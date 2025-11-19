'use client';

import {
    useEffect,
    useMemo,
    useState,
    useRef,
    type ChangeEvent,
    type FormEvent,
} from 'react';
import { useRouter } from 'next/navigation';

import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';

import { getSuppliers, type Supplier } from '@/services/supplier.service';
import { getProducts } from '@/services/product.service';
import {
    createSupplierImport,
    type SupplierImportCreateRequest,
} from '@/services/inventory.service';

import type { Product as BaseProduct } from '@/types/product';

// ====== CONFIG ẢNH ======
const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8080';

function buildImageUrl(path: string | null | undefined): string | null {
    if (!path) return null;
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    const clean = path.startsWith('/') ? path : `/${path}`;
    return `${API_BASE_URL}${clean}`;
}

// ====== TYPES ======
type Product = BaseProduct & {
    unit?: string | null;
    unitName?: string | null;
    stockQuantity?: number | null;
};

interface ProductItem {
    rowId: number;
    productId: number;
    code: string;
    name: string;
    unit: string;
    unitPrice: number;
    quantity: number;
    discount: number;
    total: number;
}

// ===== Utils =====
function formatMoney(value: number): string {
    if (!Number.isFinite(value)) return '0';
    return new Intl.NumberFormat('vi-VN').format(value);
}

function parseMoneyInput(value: string): number {
    if (!value) return 0;
    const cleaned = value.replace(/[.\s]/g, '');
    const n = Number(cleaned);
    return Number.isFinite(n) ? n : 0;
}

// ===== Modal chọn hàng hóa =====
interface ProductSelectModalProps {
    products: Product[];
    selectedProductIds: number[];
    onClose: () => void;
    onAddProducts: (products: Product[]) => void;
}

function ProductSelectModal({
    products,
    selectedProductIds,
    onClose,
    onAddProducts,
}: ProductSelectModalProps) {
    const [search, setSearch] = useState('');
    const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

    // Lọc theo tên / mã
    const filtered = useMemo(() => {
        const s = search.trim().toLowerCase();
        if (!s) return products;
        return products.filter(
            (p) =>
                p.code.toLowerCase().includes(s) || p.name.toLowerCase().includes(s),
        );
    }, [products, search]);

    const toggleSelect = (productId: number, disabled: boolean) => {
        if (disabled) return;
        setSelectedIds((prev) => {
            const next = new Set(prev);
            if (next.has(productId)) next.delete(productId);
            else next.add(productId);
            return next;
        });
    };

    const handleAdd = () => {
        const chosen = products.filter((p) => selectedIds.has(p.id as number));
        if (chosen.length === 0) {
            onClose();
            return;
        }

        onAddProducts(chosen);
        setSelectedIds(new Set());
        setSearch('');
        onClose();
    };

    const handleClose = () => {
        setSelectedIds(new Set());
        setSearch('');
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40">
            <div className="w-[900px] max-h-[80vh] bg-white rounded-xl shadow-xl flex flex-col">
                {/* header */}
                <div className="flex items-center justify-between px-6 py-4 border-b">
                    <h2 className="text-lg font-semibold">Chọn hàng hóa</h2>
                    <button
                        onClick={handleClose}
                        className="text-gray-500 hover:text-black"
                    >
                        ✕
                    </button>
                </div>

                {/* search */}
                <div className="px-6 py-3 border-b">
                    <input
                        placeholder="Tìm theo tên / mã hàng..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-sky-300"
                    />
                </div>

                {/* table */}
                <div className="flex-1 overflow-auto">
                    <table className="w-full text-sm">
                        <thead className="sticky top-0 bg-gray-100 z-10">
                            <tr>
                                <th className="px-4 py-2 text-left">Chọn</th>
                                <th className="px-4 py-2 text-left">Mã hàng</th>
                                <th className="px-4 py-2 text-left">Tên hàng</th>
                                <th className="px-4 py-2 text-right">Giá</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((p) => {
                                const alreadyInReceipt = selectedProductIds.includes(
                                    p.id as number,
                                );
                                const disabled = alreadyInReceipt;

                                return (
                                    <tr
                                        key={p.id}
                                        className={`border-t cursor-pointer ${disabled
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            : 'hover:bg-gray-50'
                                            }`}
                                        onClick={() => toggleSelect(p.id as number, disabled)}
                                    >
                                        <td className="px-4 py-2">
                                            <input
                                                type="checkbox"
                                                checked={selectedIds.has(p.id as number)}
                                                disabled={disabled}
                                                onChange={() => toggleSelect(p.id as number, disabled)}
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                        </td>
                                        <td className="px-4 py-2">{p.code}</td>
                                        <td className="px-4 py-2">
                                            {p.name}
                                            {disabled && (
                                                <span className="ml-2 text-xs text-gray-500">
                                                    (Đã có trong phiếu)
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-2 text-right">
                                            {Number(p.unitPrice ?? 0).toLocaleString('vi-VN')}
                                        </td>

                                    </tr>
                                );
                            })}

                            {filtered.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={4}
                                        className="px-4 py-4 text-center text-gray-500"
                                    >
                                        Không có sản phẩm nào
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* footer */}
                <div className="flex items-center justify-between px-6 py-4 border-t bg-gray-50 text-sm">
                    <span>
                        Đã chọn:{' '}
                        <span className="font-semibold">{selectedIds.size} sản phẩm</span>
                    </span>
                    <div className="flex gap-3">
                        <button
                            onClick={handleClose}
                            className="px-4 py-2 rounded border border-gray-300 text-sm hover:bg-gray-100"
                        >
                            Đóng
                        </button>
                        <button
                            onClick={handleAdd}
                            className="px-4 py-2 rounded bg-sky-600 text-white text-sm font-medium hover:bg-sky-700"
                        >
                            Thêm sản phẩm đã chọn
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ===== Trang tạo phiếu nhập NCC =====
export default function CreateImportReceiptPage() {
    const router = useRouter();

    // master data
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [allProducts, setAllProducts] = useState<Product[]>([]);

    // form chung
    const [supplierId, setSupplierId] = useState<number | ''>('');
    const [supplierCode, setSupplierCode] = useState('');
    const [supplierPhone, setSupplierPhone] = useState('');
    const [supplierAddress, setSupplierAddress] = useState('');
    const [note, setNote] = useState('');
    const [codeOption] = useState<'AUTO' | 'MANUAL'>('AUTO');

    // hợp đồng / sở cứ
    const [contractContent, setContractContent] = useState('');
    const [evidenceContent, setEvidenceContent] = useState('');
    const [attachmentImages, setAttachmentImages] = useState<string[]>([]);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    // danh sách sản phẩm trong phiếu
    const [items, setItems] = useState<ProductItem[]>([]);

    // modal
    const [productModalOpen, setProductModalOpen] = useState(false);

    // loading / error
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // ===== LOAD NCC + SP =====
    useEffect(() => {
        (async () => {
            try {
                const [sup, prods] = await Promise.all([getSuppliers(), getProducts()]);
                setSuppliers(sup);
                setAllProducts(
                    prods.map((p) => ({
                        ...p,
                    })),
                );
            } catch (err) {
                console.error(err);
            }
        })();
    }, []);

    // chọn NCC
    const handleSupplierChange = (value: string) => {
        if (!value) {
            setSupplierId('');
            setSupplierCode('');
            setSupplierPhone('');
            setSupplierAddress('');
            return;
        }
        const id = Number(value);
        setSupplierId(id);

        const s = suppliers.find((sp) => sp.id === id);
        if (s) {
            setSupplierCode(s.code ?? '');
            setSupplierPhone(s.phone ?? '');
            setSupplierAddress(s.address ?? '');
        }
    };

    // ====== thêm sản phẩm vào phiếu ======
    const handleAddProductsFromModal = (products: Product[]) => {
        setItems((prev) => {
            const next = [...prev];
            let currentMaxId =
                next.length === 0 ? 0 : Math.max(...next.map((i) => i.rowId));

            products.forEach((p) => {
                // tránh trùng sản phẩm
                if (next.some((it) => it.productId === p.id)) return;

                currentMaxId += 1;

                next.push({
                    rowId: currentMaxId,
                    productId: p.id as number,
                    code: p.code ?? '',
                    name: p.name ?? '',
                    unit: (p.unit as string) || (p.unitName as string) || 'Cái',
                    unitPrice: p.unitPrice ?? 0,
                    quantity: 1,
                    discount: 0,
                    total: p.unitPrice ?? 0,
                });
            });

            return next;
        });
    };

    const handleQuantityChange = (rowId: number, value: string) => {
        const quantity = Number(value) || 0;
        setItems((prev) =>
            prev.map((it) =>
                it.rowId === rowId
                    ? {
                        ...it,
                        quantity,
                        total: quantity * it.unitPrice,
                    }
                    : it,
            ),
        );
    };

    const handlePriceChange = (rowId: number, value: string) => {
        const price = parseMoneyInput(value);
        setItems((prev) =>
            prev.map((it) =>
                it.rowId === rowId
                    ? {
                        ...it,
                        unitPrice: price,
                        total: price * it.quantity,
                    }
                    : it,
            ),
        );
    };

    const deleteRow = (rowId: number) => {
        setItems((prev) => prev.filter((it) => it.rowId !== rowId));
    };

    const totalAll = useMemo(
        () => items.reduce((sum, it) => sum + it.total, 0),
        [items],
    );

    // ====== upload nhiều ảnh hợp đồng ======
    const handleImageFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files ?? []);
        if (files.length === 0) return;

        setUploadError(null);
        setUploadingImage(true);
        try {
            const { uploadProductImage } = await import(
                '@/services/product.service'
            );

            const uploaded: string[] = [];
            for (const file of files) {
                const path = await uploadProductImage(file);
                uploaded.push(path);
            }

            setAttachmentImages((prev) => [...prev, ...uploaded]);

            // cho phép chọn lại cùng file
            e.target.value = '';
        } catch (err) {
            console.error(err);
            setUploadError('Tải ảnh lên thất bại, thử lại sau');
        } finally {
            setUploadingImage(false);
        }
    };

    // ===== SUBMIT =====
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!supplierId) {
            setError('Vui lòng chọn nhà cung cấp');
            return;
        }
        if (items.length === 0) {
            setError('Vui lòng chọn ít nhất 1 sản phẩm');
            return;
        }

        const payload: SupplierImportCreateRequest = {
            storeId: 1,
            supplierId: supplierId as number,
            note,
            description: `${contractContent}\n${evidenceContent}`.trim() || undefined,
            // BE hiện chỉ có 1 field ảnh, tạm gửi ảnh cuối cùng
            attachmentImages: attachmentImages,
            items: items.map((it) => ({
                productId: it.productId,
                quantity: it.quantity,
                unitPrice: it.unitPrice,
            })),
        };

        try {
            setSaving(true);
            await createSupplierImport(payload);
            router.push('/dashboard/products/import/import-receipts');
        } catch (err) {
            console.error(err);
            if (err instanceof Error) setError(err.message);
            else setError('Có lỗi xảy ra khi tạo phiếu nhập');
        } finally {
            setSaving(false);
        }
    };

    const selectedProductIds = items.map((i) => i.productId);

    // ===== RENDER =====
    return (
        <div className="min-h-screen">
            <Header />
            <Sidebar />

            <main className="ml-[377px] mt-[113px] p-6 pr-12">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* nút thêm hàng */}
                    <div className="flex gap-4 mb-2">
                        <button
                            type="button"
                            onClick={() => setProductModalOpen(true)}
                            className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg font-bold text-sm shadow-lg transition-all"
                        >
                            + Thêm hàng
                            <br />
                            từ hệ thống
                        </button>
                    </div>

                    <div className="bg-white rounded-lg shadow-2xl p-8">
                        <h2 className="text-xl font-bold text-center mb-6">
                            PHIẾU NHẬP KHO (NCC)
                        </h2>

                        {/* Thông tin chung */}
                        <div className="border-4 border-blue-600 bg-gray-100 p-6 mb-6 rounded">
                            <h3 className="text-base font-bold mb-4">Thông tin chung</h3>

                            <div className="grid grid-cols-2 gap-x-12 gap-y-4">
                                {/* cột trái */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <label className="w-28 text-sm">Nguồn nhập</label>
                                        <div className="flex-1 relative">
                                            <select
                                                className="w-full px-3 py-1.5 border border-blue-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                                                value={supplierId}
                                                onChange={(e) => handleSupplierChange(e.target.value)}
                                            >
                                                <option value="">Chọn nhà cung cấp</option>
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
                                            readOnly
                                            value={supplierCode}
                                            className="flex-1 px-3 py-1.5 border border-blue-600 rounded bg-gray-100 text-sm"
                                        />
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <label className="w-28 text-sm">Số điện thoại</label>
                                        <input
                                            readOnly
                                            value={supplierPhone}
                                            className="flex-1 px-3 py-1.5 border border-blue-600 rounded bg-gray-100 text-sm"
                                        />
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <label className="w-28 text-sm pt-2">Địa chỉ</label>
                                        <textarea
                                            readOnly
                                            value={supplierAddress}
                                            className="flex-1 px-3 py-2 border border-blue-600 rounded bg-gray-100 text-sm h-14 resize-none"
                                        />
                                    </div>
                                </div>

                                {/* cột phải */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <label className="w-28 text-sm">Mã phiếu</label>
                                        <div className="flex-1 relative">
                                            <select
                                                value={codeOption}
                                                disabled
                                                className="w-full px-3 py-1.5 border border-gray-400 rounded bg-gray-200 text-sm"
                                            >
                                                <option value="AUTO">Tự động tạo</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <label className="w-28 text-sm pt-2">Lý do nhập</label>
                                        <textarea
                                            value={note}
                                            onChange={(e) => setNote(e.target.value)}
                                            className="flex-1 px-3 py-2 border border-blue-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 h-14 resize-none text-sm"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* bảng sản phẩm */}
                        <div className="border-4 border-gray-400 mb-6 overflow-hidden">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-[#0046ff] text-white h-10">
                                        <th className="px-2 text-center w-12">STT</th>
                                        <th className="px-2 text-center w-40">Tên hàng hóa</th>
                                        <th className="px-2 text-center w-24">Mã hàng</th>
                                        <th className="px-2 text-center w-20">ĐVT</th>
                                        <th className="px-2 text-center w-28">Đơn giá</th>
                                        <th className="px-2 text-center w-20">Số lượng</th>
                                        <th className="px-2 text-center w-28">Thành tiền</th>
                                        <th className="px-2 text-center w-16">Xóa</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map((row, index) => (
                                        <tr
                                            key={row.rowId}
                                            className="border border-gray-300 h-10 hover:bg-gray-50"
                                        >
                                            <td className="px-2 text-center">{index + 1}</td>
                                            <td className="px-2 text-left">{row.name}</td>
                                            <td className="px-2 text-center">{row.code}</td>
                                            <td className="px-2 text-center">{row.unit}</td>
                                            <td className="px-2 text-right">
                                                <input
                                                    value={formatMoney(row.unitPrice)}
                                                    onChange={(e) =>
                                                        handlePriceChange(row.rowId, e.target.value)
                                                    }
                                                    className="w-full text-right bg-transparent outline-none"
                                                />
                                            </td>
                                            <td className="px-2 text-center">
                                                <input
                                                    type="number"
                                                    min={0}
                                                    value={row.quantity}
                                                    onChange={(e) =>
                                                        handleQuantityChange(row.rowId, e.target.value)
                                                    }
                                                    className="w-full text-center bg-transparent outline-none"
                                                />
                                            </td>
                                            <td className="px-2 text-right font-medium">
                                                {formatMoney(row.total)}
                                            </td>
                                            <td className="px-2 text-center">
                                                <button
                                                    type="button"
                                                    onClick={() => deleteRow(row.rowId)}
                                                    className="hover:scale-110 transition-transform"
                                                    title="Xóa dòng"
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
                                    <tr className="border border-gray-300 h-10 bg-white">
                                        <td
                                            colSpan={6}
                                            className="px-2 text-center font-bold text-sm"
                                        >
                                            Tổng
                                        </td>
                                        <td className="px-2 text-right font-bold">
                                            {formatMoney(totalAll)}
                                        </td>
                                        <td />
                                    </tr>
                                    {items.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan={8}
                                                className="px-2 py-3 text-center text-gray-500"
                                            >
                                                Chưa có sản phẩm nào. Nhấn &quot;Thêm hàng từ hệ
                                                thống&quot; để chọn.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Hợp đồng + Sở cứ */}
                        <div className="grid grid-cols-2 gap-6 mb-6">
                            {/* Hợp đồng */}
                            <div className="border-4 border-gray-400 bg-gray-100 p-4 rounded">
                                <div className="flex items-center gap-3 mb-3">
                                    <svg
                                        width="25"
                                        height="25"
                                        viewBox="0 0 25 25"
                                        fill="none"
                                        className="text-gray-700"
                                    >
                                        <path
                                            d="M7 3H17C18.1046 3 19 3.89543 19 5V21L12 17L5 21V5C5 3.89543 5.89543 3 7 3Z"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                        />
                                    </svg>
                                    <h3 className="text-sm font-bold">Hợp đồng</h3>
                                </div>

                                <label className="block text-sm mb-2">Nội dung</label>
                                <input
                                    type="text"
                                    value={contractContent}
                                    onChange={(e) => setContractContent(e.target.value)}
                                    className="w-full px-3 py-1.5 border border-blue-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm mb-3"
                                />

                                <label className="block text-sm mb-1">
                                    Hình ảnh (bấm nút để chọn file)
                                </label>
                                <div className="flex items-center gap-3 mb-2">
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm shadow"
                                    >
                                        <svg
                                            width="18"
                                            height="18"
                                            viewBox="0 0 20 20"
                                            fill="none"
                                        >
                                            <path
                                                d="M4 14V16C4 17.1046 4.89543 18 6 18H14C15.1046 18 16 17.1046 16 16V14M10 2V14M10 2L6 6M10 2L14 6"
                                                stroke="white"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                        Chọn ảnh từ máy
                                    </button>
                                    {uploadingImage && (
                                        <span className="text-xs text-blue-600">
                                            Đang tải ảnh lên...
                                        </span>
                                    )}
                                </div>

                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    className="hidden"
                                    onChange={handleImageFileChange}
                                />

                                {uploadError && (
                                    <p className="text-xs text-red-600 mt-1">{uploadError}</p>
                                )}

                                {attachmentImages.length > 0 && (
                                    <div className="mt-2 space-y-3">
                                        {attachmentImages.map((img, idx) => {
                                            const url = buildImageUrl(img);
                                            return (
                                                <div key={`${img}-${idx}`}>
                                                    <p className="text-xs text-gray-600 break-all">
                                                        Ảnh {idx + 1}:{' '}
                                                        <span className="font-mono">{img}</span>
                                                    </p>
                                                    {url && (
                                                        <img
                                                            src={url}
                                                            alt={`Hợp đồng ${idx + 1}`}
                                                            className="mt-1 max-h-40 rounded border border-gray-300 object-contain bg-white"
                                                        />
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            {/* Sở cứ */}
                            <div className="border-4 border-gray-400 bg-gray-100 p-4 rounded">
                                <div className="flex items-center gap-3 mb-3">
                                    <svg
                                        width="25"
                                        height="25"
                                        viewBox="0 0 25 25"
                                        fill="none"
                                        className="text-gray-700"
                                    >
                                        <rect
                                            x="5"
                                            y="3"
                                            width="14"
                                            height="18"
                                            rx="1"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                        />
                                        <path
                                            d="M9 7H15M9 11H15M9 15H13"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    <h3 className="text-sm font-bold">Sở cứ</h3>
                                </div>
                                <label className="block text-sm mb-2">Nội dung</label>
                                <input
                                    type="text"
                                    value={evidenceContent}
                                    onChange={(e) => setEvidenceContent(e.target.value)}
                                    className="w-full px-3 py-1.5 border border-blue-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                />
                            </div>
                        </div>

                        {/* lỗi & nút */}
                        {error && (
                            <div className="mb-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
                                {error}
                            </div>
                        )}

                        <div className="flex justify-end gap-4">
                            <button
                                type="button"
                                className="px-8 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-sm shadow-lg transition-colors"
                                onClick={() =>
                                    router.push('/dashboard/products/import/import-receipts')
                                }
                            >
                                Hủy
                            </button>
                            <button
                                type="submit"
                                disabled={saving}
                                className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-sm shadow-lg transition-colors disabled:opacity-60"
                            >
                                {saving ? 'Đang lưu...' : 'Lưu phiếu nhập'}
                            </button>
                        </div>
                    </div>
                </form>
            </main>

            {/* Modal chọn SP – render có điều kiện để tránh lỗi setState in effect */}
            {productModalOpen && (
                <ProductSelectModal
                    products={allProducts}
                    selectedProductIds={selectedProductIds}
                    onClose={() => setProductModalOpen(false)}
                    onAddProducts={handleAddProductsFromModal}
                />
            )}
        </div>
    );
}
