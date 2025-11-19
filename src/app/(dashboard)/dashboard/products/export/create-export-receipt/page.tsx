'use client';

import {
    useEffect,
    useState,
    useRef,
    type ChangeEvent,
} from 'react';
import { useRouter } from 'next/navigation';

import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';

import {
    getSuppliers,
    type Supplier,
} from '@/services/supplier.service';

import {
    createSupplierExport,
    type SupplierExportCreateRequest,
} from '@/services/inventory.service';

import {
    getProducts,
    uploadProductImage,
} from '@/services/product.service';
import type { Product } from '@/types/product';

// ========= CẤU HÌNH ẢNH ============= //
const API_BASE_URL = 'http://localhost:8080';

function buildImageUrl(path: string | null | undefined): string {
    if (!path) return '';
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    const clean = path.startsWith('/') ? path : `/${path}`;
    return `${API_BASE_URL}${clean}`;
}

// ========= KIỂU DỮ LIỆU ============= //
interface ProductItem {
    id: number;             // STT / row (FE)
    productId: number;      // map với shop_products.products_id
    importDetailsId: number; // map với shop_import_details.import_details_id (tạm 0)
    name: string;
    code: string;
    unit: string;
    price: string;          // hiển thị, dạng "30.000.000"
    quantity: string;       // hiển thị
    discount: string;       // "5" = 5%
    total: string;          // hiển thị
    availableQuantity: number; // tồn kho hiện có (từ Product.quantity)
}

const formatCurrency = (value: number) =>
    value.toLocaleString('vi-VN', { maximumFractionDigits: 0 });

const parseNumber = (value: string): number => {
    const cleaned = value.replace(/[^\d]/g, '');
    return cleaned ? Number(cleaned) : 0;
};

export default function TaoPhieuXuatKho() {
    const router = useRouter();

    // ====== NCC / nguồn nhận ====== //
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [selectedSupplierId, setSelectedSupplierId] = useState<number | ''>('');

    // ====== Thông tin chung ====== //
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [reason, setReason] = useState(''); // lý do xuất
    const [note, setNote] = useState('');     // ghi chú / mô tả hợp đồng / khác

    // ====== Hàng hóa ====== //
    const [products, setProducts] = useState<ProductItem[]>([]);

    const [loadingSuppliers, setLoadingSuppliers] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // ====== Popup chọn hàng hóa từ danh sách sản phẩm thật ====== //
    const [showProductModal, setShowProductModal] = useState(false);
    const [productList, setProductList] = useState<Product[]>([]);
    const [loadingProducts, setLoadingProducts] = useState(false);
    const [productError, setProductError] = useState<string | null>(null);
    const [selectedProductIds, setSelectedProductIds] = useState<number[]>([]);

    // ====== ẢNH HỢP ĐỒNG & SỞ CỨ (NHIỀU ẢNH) ====== //
    const [contractImageUrls, setContractImageUrls] = useState<string[]>([]);
    const [supportImageUrls, setSupportImageUrls] = useState<string[]>([]);
    const [uploadingContractImages, setUploadingContractImages] = useState(false);
    const [uploadingSupportImages, setUploadingSupportImages] = useState(false);

    const contractFileInputRef = useRef<HTMLInputElement | null>(null);
    const supportFileInputRef = useRef<HTMLInputElement | null>(null);

    // ====== Load NCC ====== //
    useEffect(() => {
        const fetchSuppliers = async () => {
            try {
                setLoadingSuppliers(true);
                const list = await getSuppliers();
                setSuppliers(list);
            } catch (e) {
                console.error(e);
                setError(
                    e instanceof Error
                        ? e.message
                        : 'Có lỗi xảy ra khi tải danh sách nhà cung cấp',
                );
            } finally {
                setLoadingSuppliers(false);
            }
        };

        fetchSuppliers();
    }, []);

    // auto fill SĐT / địa chỉ theo NCC //
    useEffect(() => {
        if (!selectedSupplierId) return;
        const s = suppliers.find((x) => x.id === selectedSupplierId);
        if (!s) return;
        setPhone(s.phone ?? '');
        setAddress(s.address ?? '');
    }, [selectedSupplierId, suppliers]);

    // ====== TÍNH TOÁN TIỀN ====== //
    const recalcRowTotal = (item: ProductItem): ProductItem => {
        const price = parseNumber(item.price);
        const qty = parseNumber(item.quantity);
        const discountPercent = parseNumber(item.discount); // 5 => 5%

        let total = price * qty;
        if (discountPercent > 0) {
            total = (total * (100 - discountPercent)) / 100;
        }

        return {
            ...item,
            total: total > 0 ? formatCurrency(total) : '',
        };
    };

    const handleChangeProductField = (
        id: number,
        field: keyof ProductItem,
        value: string,
    ) => {
        setProducts((prev) =>
            prev.map((p) => {
                if (p.id !== id) return p;
                const updated: ProductItem = { ...p, [field]: value } as ProductItem;
                return recalcRowTotal(updated);
            }),
        );
    };

    const calculateTotal = () => {
        const sum = products.reduce((acc, item) => {
            const total = parseNumber(item.total);
            return acc + total;
        }, 0);
        return formatCurrency(sum);
    };

    const deleteProduct = (id: number) => {
        setProducts((prev) => prev.filter((p) => p.id !== id));
    };

    // ====== POPUP THÊM HÀNG TỪ HỆ THỐNG ====== //
    const openProductModal = async () => {
        setShowProductModal(true);
        setProductError(null);

        // Khi mở popup, tự tick các sản phẩm đã có trong phiếu
        const idsFromCurrent = products.map((p) => p.productId);
        setSelectedProductIds(idsFromCurrent);

        if (productList.length > 0) return;

        try {
            setLoadingProducts(true);
            const list = await getProducts();
            setProductList(list);
        } catch (e) {
            console.error(e);
            setProductError(
                e instanceof Error
                    ? e.message
                    : 'Có lỗi xảy ra khi tải danh sách hàng hóa',
            );
        } finally {
            setLoadingProducts(false);
        }
    };

    const closeProductModal = () => {
        setShowProductModal(false);
        // KHÔNG xoá selectedProductIds để lần sau mở lại vẫn còn tick
    };

    const toggleSelectProduct = (productId: number) => {
        setSelectedProductIds((prev) =>
            prev.includes(productId)
                ? prev.filter((id) => id !== productId)
                : [...prev, productId],
        );
    };

    const handleAddSelectedProducts = () => {
        if (selectedProductIds.length === 0) {
            closeProductModal();
            return;
        }

        setProducts((prev) => {
            const existingProductIds = new Set(prev.map((p) => p.productId));
            let runningRowId = prev.length > 0 ? Math.max(...prev.map((p) => p.id)) : 0;

            const newRows: ProductItem[] = [];

            selectedProductIds.forEach((pid) => {
                // đã có trong bảng chính thì không thêm nữa
                if (existingProductIds.has(pid)) return;

                const prod = productList.find((p) => p.id === pid);
                if (!prod) return;

                runningRowId += 1;

                const row: ProductItem = {
                    id: runningRowId,
                    productId: prod.id,
                    importDetailsId: 0, // TODO: sau này map với import_detail thực tế
                    name: prod.name,
                    code: prod.code,
                    unit: 'Cái', // nếu có unit trong Product thì map sang
                    price: formatCurrency(prod.unitPrice ?? 0),
                    quantity: '',
                    discount: '',
                    total: '',
                    availableQuantity: prod.quantity ?? 0,
                };

                newRows.push(row);
            });

            return [...prev, ...newRows];
        });

        closeProductModal();
    };

    // ====== UPLOAD ẢNH HỢP ĐỒNG (NHIỀU ẢNH) ====== //
    const handleClickUploadContractImages = () => {
        contractFileInputRef.current?.click();
    };

    const handleContractFilesChange = async (
        e: ChangeEvent<HTMLInputElement>,
    ) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        try {
            setUploadingContractImages(true);
            const uploadedUrls: string[] = [];

            for (const file of Array.from(files)) {
                const url = await uploadProductImage(file);
                uploadedUrls.push(url);
            }

            setContractImageUrls((prev) => [...prev, ...uploadedUrls]);
            setError(null);
        } catch (err) {
            console.error(err);
            setError(
                err instanceof Error
                    ? err.message
                    : 'Tải ảnh hợp đồng thất bại',
            );
        } finally {
            setUploadingContractImages(false);
            e.target.value = '';
        }
    };

    const removeContractImage = (url: string) => {
        setContractImageUrls((prev) => prev.filter((u) => u !== url));
    };

    // ====== UPLOAD ẢNH SỞ CỨ (NHIỀU ẢNH) ====== //
    const handleClickUploadSupportImages = () => {
        supportFileInputRef.current?.click();
    };

    const handleSupportFilesChange = async (
        e: ChangeEvent<HTMLInputElement>,
    ) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        try {
            setUploadingSupportImages(true);
            const uploadedUrls: string[] = [];

            for (const file of Array.from(files)) {
                const url = await uploadProductImage(file);
                uploadedUrls.push(url);
            }

            setSupportImageUrls((prev) => [...prev, ...uploadedUrls]);
            setError(null);
        } catch (err) {
            console.error(err);
            setError(
                err instanceof Error
                    ? err.message
                    : 'Tải ảnh sở cứ thất bại',
            );
        } finally {
            setUploadingSupportImages(false);
            e.target.value = '';
        }
    };

    const removeSupportImage = (url: string) => {
        setSupportImageUrls((prev) => prev.filter((u) => u !== url));
    };

    // ====== Submit tạo phiếu ====== //
    const handleSave = async () => {
        try {
            setError(null);
            setSuccess(null);

            if (!selectedSupplierId) {
                setError('Vui lòng chọn nguồn nhận / nhà cung cấp');
                return;
            }

            if (products.length === 0) {
                setError('Vui lòng thêm ít nhất 1 hàng hóa');
                return;
            }

            // Kiểm tra số lượng không vượt tồn kho
            const overItems: string[] = [];
            for (const p of products) {
                const qty = parseNumber(p.quantity);
                if (!qty) continue;
                if (p.availableQuantity != null && qty > p.availableQuantity) {
                    overItems.push(
                        `${p.name} (tồn ${p.availableQuantity}, nhập ${qty})`,
                    );
                }
            }
            if (overItems.length > 0) {
                setError(
                    `Số lượng vượt quá tồn kho cho:\n- ${overItems.join('\n- ')}`,
                );
                return;
            }

            const items = products
                .filter((p) => parseNumber(p.quantity) > 0 && parseNumber(p.price) > 0)
                .map((p) => ({
                    importDetailsId: p.importDetailsId, // hiện đang là 0 / fake, sau map thật
                    productId: p.productId,
                    quantity: parseNumber(p.quantity),
                    unitPrice: parseNumber(p.price),
                }));

            if (items.length === 0) {
                setError('Vui lòng nhập ít nhất 1 hàng hóa có số lượng > 0');
                return;
            }

            // Gộp note + URL ảnh lại, nhưng GIỚI HẠN độ dài để không lỗi cột note
            const noteParts: string[] = [];
            if (note) noteParts.push(note);

            if (contractImageUrls.length > 0) {
                noteParts.push(
                    `Hợp đồng: ${contractImageUrls.join(', ')}`,
                );
            }
            if (supportImageUrls.length > 0) {
                noteParts.push(
                    `Sở cứ: ${supportImageUrls.join(', ')}`,
                );
            }

            let noteToSend = noteParts.join(' | ');

            // Tránh lỗi "Data too long for column 'note'"
            const MAX_NOTE_LEN = 240; // tạm cho là 240, dư 1 chút so với VARCHAR(255)
            if (noteToSend.length > MAX_NOTE_LEN) {
                noteToSend = noteToSend.slice(0, MAX_NOTE_LEN - 3) + '...';
            }

            const payload: SupplierExportCreateRequest = {
                storeId: 1, // TODO: nếu bạn có store hiện tại thì thay ở đây
                supplierId: selectedSupplierId as number,
                note: noteToSend || undefined,
                description: reason || undefined,
                items,
            };

            setSaving(true);
            const created = await createSupplierExport(payload);

            setSuccess(`Tạo phiếu xuất kho thành công (Mã: ${created.code ?? created.id})`);

            setTimeout(() => {
                router.push('/dashboard/products/export/export-receipts');
            }, 800);
        } catch (e) {
            console.error(e);
            setError(
                e instanceof Error
                    ? e.message
                    : 'Có lỗi xảy ra khi tạo phiếu xuất kho',
            );
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="min-h-screen">
            <Header />
            <Sidebar />

            <main className="ml-[377px] mt-[113px] p-6 pr-12">
                {/* Breadcrumb */}
                <div className="mb-4">
                    <p className="text-base font-bold text-gray-800">
                        Xuất - nhập với NCC &gt; Tạo mới phiếu xuất kho
                    </p>
                </div>

                {/* Thông báo */}
                {error && (
                    <div className="mb-4 text-sm text-red-600 whitespace-pre-line bg-red-50 border border-red-200 rounded px-4 py-2">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="mb-4 text-sm text-green-700 bg-green-50 border border-green-200 rounded px-4 py-2">
                        {success}
                    </div>
                )}

                {/* Action Buttons (thêm hàng) */}
                <div className="flex gap-4 mb-6">
                    <button
                        type="button"
                        onClick={openProductModal}
                        className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg font-bold text-sm shadow-lg transition-all"
                    >
                        + Thêm hàng
                        <br />
                        từ hệ thống
                    </button>
                    <button className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg font-bold text-sm shadow-lg transition-all">
                        + Thêm hàng
                        <br />
                        từ file ngoài
                    </button>
                </div>

                {/* Main Form */}
                <div className="bg-white rounded-lg shadow-2xl p-8">
                    <h2 className="text-xl font-bold text-center mb-6">PHIẾU XUẤT KHO</h2>

                    {/* Thông tin chung */}
                    <div className="border-4 border-blue-600 bg-gray-100 p-6 mb-6 rounded">
                        <h3 className="text-base font-bold mb-4">Thông tin chung</h3>

                        <div className="grid grid-cols-2 gap-x-12 gap-y-4">
                            {/* Left Column */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <label className="w-28 text-sm">Nguồn nhận</label>
                                    <div className="flex-1 relative">
                                        <select
                                            className="w-full px-3 py-1.5 border border-blue-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                                            disabled={loadingSuppliers}
                                            value={
                                                selectedSupplierId === ''
                                                    ? ''
                                                    : String(selectedSupplierId)
                                            }
                                            onChange={(e) =>
                                                setSelectedSupplierId(
                                                    e.target.value ? Number(e.target.value) : '',
                                                )
                                            }
                                        >
                                            <option value="">Chọn nguồn nhận</option>
                                            {suppliers.map((s) => (
                                                <option key={s.id} value={s.id}>
                                                    {s.name}
                                                </option>
                                            ))}
                                        </select>
                                        <svg
                                            className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M19 9l-7 7-7-7"
                                            />
                                        </svg>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <label className="w-28 text-sm">Mã nguồn</label>
                                    <input
                                        type="text"
                                        className="flex-1 px-3 py-1.5 border border-blue-600 rounded bg-gray-100 focus:outline-none"
                                        value={
                                            selectedSupplierId
                                                ? suppliers.find((s) => s.id === selectedSupplierId)
                                                    ?.code ?? ''
                                                : ''
                                        }
                                        readOnly
                                    />
                                </div>

                                <div className="flex items-center gap-3">
                                    <label className="w-28 text-sm">Số điện thoại</label>
                                    <input
                                        type="text"
                                        className="flex-1 px-3 py-1.5 border border-blue-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                    />
                                </div>

                                <div className="flex items-start gap-3">
                                    <label className="w-28 text-sm pt-2">Địa chỉ</label>
                                    <textarea
                                        className="flex-1 px-3 py-2 border border-blue-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 h-14 resize-none"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <label className="w-28 text-sm">Mã phiếu</label>
                                    <div className="flex-1 relative">
                                        <select className="w-full px-3 py-1.5 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-gray-200">
                                            <option>Tự động tạo</option>
                                        </select>
                                        <svg
                                            className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M19 9l-7 7-7-7"
                                            />
                                        </svg>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <label className="w-28 text-sm pt-2">Lý do xuất</label>
                                    <textarea
                                        className="flex-1 px-3 py-2 border border-blue-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 h-14 resize-none"
                                        value={reason}
                                        onChange={(e) => setReason(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Product Table */}
                    <div className="border-4 border-gray-400 mb-6 overflow-hidden">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-[#0046ff] text-white h-12">
                                    <th className="px-2 text-center font-bold text-sm w-12">
                                        STT
                                    </th>
                                    <th className="px-2 text-center font-bold text-sm w-40">
                                        Tên hàng hóa
                                    </th>
                                    <th className="px-2 text-center font-bold text-sm w-24">
                                        Mã hàng
                                    </th>
                                    <th className="px-2 text-center font-bold text-sm w-20">
                                        Đơn vị tính
                                    </th>
                                    <th className="px-2 text-center font-bold text-sm w-24">
                                        Tồn kho
                                    </th>
                                    <th className="px-2 text-center font-bold text-sm w-28">
                                        Đơn giá
                                    </th>
                                    <th className="px-2 text-center font-bold text-sm w-20">
                                        Số lượng
                                    </th>
                                    <th className="px-2 text-center font-bold text-sm w-24">
                                        Chiết khấu (%)
                                    </th>
                                    <th className="px-2 text-center font-bold text-sm w-28">
                                        Thành tiền
                                    </th>
                                    <th className="px-2 text-center font-bold text-sm w-16">
                                        Xóa
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product, index) => (
                                    <tr
                                        key={product.id}
                                        className="border border-gray-400 h-12 hover:bg-gray-50"
                                    >
                                        <td className="px-2 text-center text-sm border-r border-gray-400">
                                            {index + 1}
                                        </td>
                                        <td className="px-2 text-left text-sm border-r border-gray-400">
                                            {product.name}
                                        </td>
                                        <td className="px-2 text-center text-sm border-r border-gray-400">
                                            {product.code}
                                        </td>
                                        <td className="px-2 text-center text-sm border-r border-gray-400">
                                            {product.unit}
                                        </td>
                                        <td className="px-2 text-center text-sm border-r border-gray-400">
                                            {product.availableQuantity ?? 0}
                                        </td>
                                        <td className="px-2 text-right text-sm border-r border-gray-400">
                                            <input
                                                className="w-full text-right bg-transparent focus:outline-none"
                                                value={product.price}
                                                onChange={(e) =>
                                                    handleChangeProductField(
                                                        product.id,
                                                        'price',
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </td>
                                        <td className="px-2 text-center text-sm border-r border-gray-400">
                                            <input
                                                className="w-full text-center bg-transparent focus:outline-none"
                                                value={product.quantity}
                                                onChange={(e) =>
                                                    handleChangeProductField(
                                                        product.id,
                                                        'quantity',
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </td>
                                        <td className="px-2 text-center text-sm border-r border-gray-400">
                                            <input
                                                className="w-full text-center bg-transparent focus:outline-none"
                                                value={product.discount}
                                                onChange={(e) =>
                                                    handleChangeProductField(
                                                        product.id,
                                                        'discount',
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </td>
                                        <td className="px-2 text-right text-sm font-medium border-r border-gray-400">
                                            {product.total}
                                        </td>
                                        <td className="px-2 text-center border-r border-gray-400">
                                            <button
                                                type="button"
                                                onClick={() => deleteProduct(product.id)}
                                                className="hover:scale-110 transition-transform"
                                            >
                                                <svg
                                                    width="22"
                                                    height="22"
                                                    viewBox="0 0 22 22"
                                                    fill="none"
                                                >
                                                    <path
                                                        d="M3 6H19M8 6V4C8 3.44772 8.44772 3 9 3H13C13.5523 3 14 3.44772 14 4V6M17 6V18C17 18.5523 16.5523 19 16 19H6C5.44772 19 5 18.5523 5 18V6H17Z"
                                                        stroke="#f90606"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                <tr className="border border-gray-400 h-12 bg-white">
                                    <td
                                        colSpan={8}
                                        className="px-2 text-center font-bold text-sm border-r border-gray-400"
                                    >
                                        Tổng
                                    </td>
                                    <td className="px-2 text-right font-bold text-sm border-r border-gray-400">
                                        {calculateTotal()}
                                    </td>
                                    <td className="border-r border-gray-400" />
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Hợp đồng */}
                    <div className="border-4 border-gray-400 bg-gray-100 p-6 mb-6 rounded">
                        <div className="flex items-center gap-4 mb-4">
                            <svg width="25" height="25" viewBox="0 0 25 25" fill="none">
                                <path
                                    d="M7 3H17C18.1046 3 19 3.89543 19 5V21L12 17L5 21V5C5 3.89543 5.89543 3 7 3Z"
                                    stroke="#000"
                                    strokeWidth="2"
                                />
                            </svg>
                            <h3 className="text-sm font-bold">Hợp đồng</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm mb-2">Nội dung</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-1.5 border border-blue-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm mb-2">
                                    Hình ảnh (tải nhiều ảnh)
                                </label>
                                <div className="flex gap-2 items-center">
                                    <button
                                        type="button"
                                        onClick={handleClickUploadContractImages}
                                        className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded shadow-lg transition-colors disabled:opacity-60"
                                        disabled={uploadingContractImages}
                                    >
                                        {uploadingContractImages ? 'Đang tải...' : 'Chọn ảnh'}
                                    </button>

                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        ref={contractFileInputRef}
                                        className="hidden"
                                        onChange={handleContractFilesChange}
                                    />
                                </div>

                                <div className="mt-2 flex flex-wrap gap-2">
                                    {contractImageUrls.map((url) => (
                                        <div
                                            key={url}
                                            className="w-20 h-20 border rounded flex items-center justify-center relative overflow-hidden"
                                        >
                                            <img
                                                src={buildImageUrl(url)}
                                                alt="Hợp đồng"
                                                className="w-full h-full object-cover"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeContractImage(url)}
                                                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-[10px] flex items-center justify-center"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sở cứ */}
                    <div className="border-4 border-gray-400 bg-gray-100 p-6 mb-6 rounded">
                        <div className="flex items-center gap-4 mb-4">
                            <svg width="25" height="25" viewBox="0 0 25 25" fill="none">
                                <rect
                                    x="5"
                                    y="3"
                                    width="14"
                                    height="18"
                                    rx="1"
                                    stroke="#000"
                                    strokeWidth="2"
                                />
                                <path
                                    d="M9 7H15M9 11H15M9 15H13"
                                    stroke="#000"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                />
                            </svg>
                            <h3 className="text-sm font-bold">Sở cứ</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm mb-2">Nội dung</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-1.5 border border-blue-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm mb-2">
                                    Hình ảnh (tải nhiều ảnh)
                                </label>
                                <div className="flex gap-2 items-center">
                                    <button
                                        type="button"
                                        onClick={handleClickUploadSupportImages}
                                        className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded shadow-lg transition-colors disabled:opacity-60"
                                        disabled={uploadingSupportImages}
                                    >
                                        {uploadingSupportImages ? 'Đang tải...' : 'Chọn ảnh'}
                                    </button>

                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        ref={supportFileInputRef}
                                        className="hidden"
                                        onChange={handleSupportFilesChange}
                                    />
                                </div>

                                <div className="mt-2 flex flex-wrap gap-2">
                                    {supportImageUrls.map((url) => (
                                        <div
                                            key={url}
                                            className="w-20 h-20 border rounded flex items-center justify-center relative overflow-hidden"
                                        >
                                            <img
                                                src={buildImageUrl(url)}
                                                alt="Sở cứ"
                                                className="w-full h-full object-cover"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeSupportImage(url)}
                                                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-[10px] flex items-center justify-center"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-6">
                        <button
                            className="px-8 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-sm shadow-lg transition-colors"
                            onClick={() =>
                                router.push('/dashboard/products/export/export-receipts')
                            }
                        >
                            Hủy
                        </button>
                        <button
                            className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-sm shadow-lg transition-colors disabled:opacity-60"
                            onClick={handleSave}
                            disabled={saving}
                        >
                            {saving ? 'Đang lưu...' : 'Lưu'}
                        </button>
                    </div>
                </div>
            </main>

            {/* ===== MODAL CHỌN HÀNG HÓA ===== */}
            {showProductModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-2xl w-[900px] max-h-[80vh] flex flex-col">
                        <div className="px-4 py-3 border-b flex items-center justify-between">
                            <h3 className="font-semibold text-base">
                                Chọn hàng hóa từ danh sách hệ thống
                            </h3>
                            <button
                                type="button"
                                onClick={closeProductModal}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="p-4 flex-1 overflow-auto">
                            {loadingProducts ? (
                                <p className="text-sm text-gray-500">
                                    Đang tải danh sách hàng hóa...
                                </p>
                            ) : productError ? (
                                <p className="text-sm text-red-600">{productError}</p>
                            ) : (
                                <table className="w-full text-sm border border-gray-200">
                                    <thead>
                                        <tr className="bg-gray-100 h-10">
                                            <th className="w-10 px-2 text-center border-b border-r">
                                                Chọn
                                            </th>
                                            <th className="px-2 text-left border-b border-r">
                                                Tên hàng
                                            </th>
                                            <th className="px-2 text-center border-b border-r">
                                                Mã hàng
                                            </th>
                                            <th className="px-2 text-center border-b border-r">
                                                Tồn kho
                                            </th>
                                            <th className="px-2 text-center border-b border-r">
                                                Đơn giá
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {productList.map((p) => (
                                            <tr
                                                key={p.id}
                                                className="h-9 hover:bg-gray-50 border-b last:border-b-0"
                                            >
                                                <td className="px-2 text-center border-r">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedProductIds.includes(p.id)}
                                                        onChange={() => toggleSelectProduct(p.id)}
                                                    />
                                                </td>
                                                <td className="px-2 border-r">{p.name}</td>
                                                <td className="px-2 text-center border-r">
                                                    {p.code}
                                                </td>
                                                <td className="px-2 text-center border-r">
                                                    {p.quantity ?? 0}
                                                </td>
                                                <td className="px-2 text-right">
                                                    {formatCurrency(p.unitPrice ?? 0)}
                                                </td>
                                            </tr>
                                        ))}
                                        {productList.length === 0 && !loadingProducts && (
                                            <tr>
                                                <td
                                                    colSpan={5}
                                                    className="px-2 py-3 text-center text-gray-500"
                                                >
                                                    Không có hàng hóa nào
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            )}
                        </div>

                        <div className="px-4 py-3 border-t flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={closeProductModal}
                                className="px-5 py-2 text-sm rounded border border-gray-300 hover:bg-gray-100"
                            >
                                Đóng
                            </button>
                            <button
                                type="button"
                                onClick={handleAddSelectedProducts}
                                className="px-5 py-2 text-sm rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold disabled:opacity-60"
                                disabled={loadingProducts || productList.length === 0}
                            >
                                Thêm hàng đã chọn
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
