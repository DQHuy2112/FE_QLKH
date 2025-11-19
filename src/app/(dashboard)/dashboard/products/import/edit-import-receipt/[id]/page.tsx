'use client';

import {
    useEffect,
    useMemo,
    useState,
    useRef,
    type ChangeEvent,
    type FormEvent,
    type ReactNode,
} from 'react';
import { useRouter, useParams } from 'next/navigation';

import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';

import { getSuppliers, type Supplier } from '@/services/supplier.service';
import { getProducts, getProduct } from '@/services/product.service';

import {
    type SupplierImportCreateRequest,
    getSupplierImport,
    updateSupplierImport,
    type SupplierImportDetail,
} from '@/services/inventory.service';

import type { Product as BaseProduct } from '@/types/product';

/* ============================================================
   CONFIG ẢNH
============================================================ */
const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8080';

function buildImageUrl(path: string | null | undefined): string | null {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `${API_BASE_URL}${path.startsWith('/') ? path : '/' + path}`;
}

/* ============================================================
   TYPES
============================================================ */
type Product = BaseProduct & {
    unit?: string | null;
    unitName?: string | null;
};

interface ProductItem {
    rowId: number;
    productId: number;
    code: string;
    name: string;
    unit: string;
    unitPrice: number;
    quantity: number;
    total: number;
}

/* ============================================================
   UTILS
============================================================ */
const formatMoney = (v: number) =>
    new Intl.NumberFormat('vi-VN').format(v || 0);

const parseMoney = (v: string) =>
    Number((v || '0').replace(/[.\s]/g, '')) || 0;

/* ============================================================
   TRANG EDIT PHIẾU NHẬP NCC
============================================================ */
export default function EditImportReceiptPage() {
    const router = useRouter();
    const params = useParams();
    const importId = Number(
        Array.isArray(params?.id) ? params.id[0] : params?.id,
    );

    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [items, setItems] = useState<ProductItem[]>([]);

    const [supplierId, setSupplierId] = useState<number | ''>('');
    const [supplierCode, setSupplierCode] = useState('');
    const [supplierPhone, setSupplierPhone] = useState('');
    const [supplierAddress, setSupplierAddress] = useState('');

    const [note, setNote] = useState('');
    const [contractContent, setContractContent] = useState('');
    const [evidenceContent, setEvidenceContent] = useState('');
    const [attachmentImages, setAttachmentImages] = useState<string[]>([]);

    const fileRef = useRef<HTMLInputElement | null>(null);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /* ============================================================
       LOAD DỮ LIỆU PHIẾU NHẬP
    ============================================================ */
    useEffect(() => {
        if (!importId) return;

        (async () => {
            try {
                const [sup, productList, receipt] = await Promise.all([
                    getSuppliers(),
                    getProducts(),
                    getSupplierImport(importId),
                ]);

                setSuppliers(sup);
                setAllProducts(productList);

                /* --- NCC --- */
                setSupplierId(receipt.supplierId);

                // ⭐ Tự động fill thông tin NCC từ danh sách suppliers
                const selectedSupplier = sup.find((s) => s.id === receipt.supplierId);
                if (selectedSupplier) {
                    setSupplierCode(selectedSupplier.code ?? '');
                    setSupplierPhone(selectedSupplier.phone ?? '');
                    setSupplierAddress(selectedSupplier.address ?? '');
                } else {
                    // Fallback: dùng thông tin từ receipt nếu không tìm thấy supplier
                    setSupplierCode(receipt.supplierCode ?? '');
                    setSupplierPhone(receipt.supplierPhone ?? '');
                    setSupplierAddress(receipt.supplierAddress ?? '');
                }

                setNote(receipt.note ?? '');

                /* --- mô tả --- */
                const desc = receipt.description ?? '';
                const [c1, ...c2] = desc.split('\n');
                setContractContent(c1 ?? '');
                setEvidenceContent(c2.join('\n') ?? '');

                /* --- Ảnh --- */
                setAttachmentImages(receipt.attachmentImages ?? []);

                /* --- sản phẩm --- */
                const rawItems = receipt.items ?? [];

                // ⭐ Fetch thông tin sản phẩm cho từng item
                const mapped: ProductItem[] = await Promise.all(
                    rawItems.map(async (it: SupplierImportDetail, idx) => {
                        let code = '';
                        let name = '';
                        let unit = 'Cái';

                        // Nếu đã có sẵn thông tin sản phẩm từ BE
                        if (it.productCode && it.productName) {
                            code = it.productCode;
                            name = it.productName;
                            unit = it.unit || it.unitName || 'Cái';
                        }
                        // Nếu chỉ có productId, gọi API để lấy thông tin
                        else if (it.productId) {
                            try {
                                const product = await getProduct(it.productId);
                                code = product.code;
                                name = product.name;
                                unit = 'Cái'; // Hoặc lấy từ product nếu có field unit
                            } catch (err) {
                                console.error('Failed to fetch product:', it.productId, err);
                            }
                        }

                        return {
                            rowId: idx + 1,
                            productId: it.productId,
                            code,
                            name,
                            unit,
                            unitPrice: it.unitPrice,
                            quantity: it.quantity,
                            total: it.unitPrice * it.quantity,
                        };
                    })
                );

                setItems(mapped);
            } catch (err) {
                console.error(err);
                setError('Không tải được phiếu nhập');
            } finally {
                setLoading(false);
            }
        })();
    }, [importId]);

    /* ============================================================
       HANDLE NCC
    ============================================================ */
    const changeSupplier = (v: string) => {
        if (!v) {
            setSupplierId('');
            setSupplierCode('');
            setSupplierPhone('');
            setSupplierAddress('');
            return;
        }

        const id = Number(v);
        const sp = suppliers.find((s) => s.id === id);
        setSupplierId(id);

        if (sp) {
            setSupplierCode(sp.code ?? '');
            setSupplierPhone(sp.phone ?? '');
            setSupplierAddress(sp.address ?? '');
        }
    };

    /* ============================================================
       HANDLE IMAGE UPLOAD
    ============================================================ */
    const handleUploadImages = async (e: ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files ?? []);
        if (!files.length) return;

        const { uploadProductImage } = await import('@/services/product.service');

        const uploaded: string[] = [];

        for (const f of files) {
            const path = await uploadProductImage(f);
            uploaded.push(path);
        }

        setAttachmentImages((prev) => [...prev, ...uploaded]);

        e.target.value = '';
    };

    /* ============================================================
       HANDLE PRODUCT TABLE
    ============================================================ */
    const changeQty = (rowId: number, v: string) => {
        const q = Number(v) || 0;
        setItems((prev) =>
            prev.map((it) =>
                it.rowId === rowId
                    ? { ...it, quantity: q, total: q * it.unitPrice }
                    : it,
            ),
        );
    };

    const changePrice = (rowId: number, v: string) => {
        const p = parseMoney(v);
        setItems((prev) =>
            prev.map((it) =>
                it.rowId === rowId
                    ? { ...it, unitPrice: p, total: p * it.quantity }
                    : it,
            ),
        );
    };

    const deleteRow = (rowId: number) =>
        setItems((prev) => prev.filter((it) => it.rowId !== rowId));

    const totalAll = useMemo(
        () => items.reduce((s, it) => s + it.total, 0),
        [items],
    );

    /* ============================================================
       SUBMIT UPDATE
    ============================================================ */
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!supplierId) return setError('Chọn nhà cung cấp');
        if (items.length === 0) return setError('Chọn sản phẩm');

        const payload: SupplierImportCreateRequest = {
            storeId: 1,
            supplierId: supplierId as number,
            note,
            description: `${contractContent}\n${evidenceContent}`.trim(),
            attachmentImages,
            items: items.map((it) => ({
                productId: it.productId,
                quantity: it.quantity,
                unitPrice: it.unitPrice,
            })),
        };

        try {
            setSaving(true);
            await updateSupplierImport(importId, payload);
            router.push('/dashboard/products/import/import-receipts');
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Lỗi cập nhật');
        } finally {
            setSaving(false);
        }
    };

    /* ============================================================
       RENDER
    ============================================================ */

    if (loading)
        return (
            <div className="ml-[377px] mt-[120px] text-lg">Đang tải dữ liệu…</div>
        );

    return (
        <div className="min-h-screen">
            <Header />
            <Sidebar />

            <main className="ml-[377px] mt-[113px] p-6 pr-12">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* ======================================================================
                       THÔNG TIN CHUNG
                    ====================================================================== */}
                    <div className="bg-white shadow-xl p-8 rounded-lg">
                        <h2 className="text-xl font-bold text-center mb-6">
                            CẬP NHẬT PHIẾU NHẬP KHO (NCC)
                        </h2>

                        <div className="grid grid-cols-2 gap-10">
                            <div className="space-y-4">
                                <div className="flex gap-3">
                                    <label className="w-32">Nguồn nhập</label>
                                    <select
                                        className="border px-3 py-1 rounded flex-1"
                                        value={supplierId}
                                        onChange={(e) =>
                                            changeSupplier(e.target.value)
                                        }
                                    >
                                        <option value="">-- Chọn NCC --</option>
                                        {suppliers.map((s) => (
                                            <option key={s.id} value={s.id}>
                                                {s.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex gap-3">
                                    <label className="w-32">Mã nguồn</label>
                                    <input
                                        type="text"
                                        value={supplierCode}
                                        onChange={(e) => setSupplierCode(e.target.value)}
                                        className="border px-3 py-1 rounded flex-1"
                                    />
                                </div>

                                <div className="flex gap-3">
                                    <label className="w-32">Số điện thoại</label>
                                    <input
                                        type="text"
                                        value={supplierPhone}
                                        onChange={(e) => setSupplierPhone(e.target.value)}
                                        className="border px-3 py-1 rounded flex-1"
                                    />
                                </div>

                                <div className="flex gap-3 items-start">
                                    <label className="w-32 pt-1">Địa chỉ</label>
                                    <textarea
                                        value={supplierAddress}
                                        onChange={(e) => setSupplierAddress(e.target.value)}
                                        className="border px-3 py-1 rounded flex-1 h-16"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <InfoLine label="Lý do nhập">
                                    <textarea
                                        value={note}
                                        onChange={(e) => setNote(e.target.value)}
                                        className="w-full border rounded p-2 h-16"
                                    />
                                </InfoLine>
                            </div>
                        </div>
                    </div>

                    {/* ======================================================================
                       BẢNG SẢN PHẨM
                    ====================================================================== */}
                    <div className="border-2 border-gray-400 rounded overflow-hidden">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-blue-600 text-white h-10">
                                    <th className="px-2 w-12 text-center">STT</th>
                                    <th className="px-2 w-40 text-left">
                                        Tên hàng hóa
                                    </th>
                                    <th className="px-2 w-24 text-center">
                                        Mã hàng
                                    </th>
                                    <th className="px-2 w-20 text-center">ĐVT</th>
                                    <th className="px-2 w-28 text-right">Đơn giá</th>
                                    <th className="px-2 w-20 text-center">
                                        Số lượng
                                    </th>
                                    <th className="px-2 w-28 text-right">
                                        Thành tiền
                                    </th>
                                    <th className="px-2 w-16 text-center">Xóa</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((row, idx) => (
                                    <tr
                                        key={row.rowId}
                                        className="border-b border-gray-300 h-10 hover:bg-gray-50"
                                    >
                                        <td className="px-2 text-center">
                                            {idx + 1}
                                        </td>
                                        <td className="px-2 text-left">{row.name}</td>
                                        <td className="px-2 text-center">
                                            {row.code}
                                        </td>
                                        <td className="px-2 text-center">
                                            {row.unit}
                                        </td>
                                        <td className="px-2 text-right">
                                            <input
                                                className="w-full bg-transparent outline-none text-right"
                                                value={formatMoney(row.unitPrice)}
                                                onChange={(e) =>
                                                    changePrice(
                                                        row.rowId,
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </td>
                                        <td className="px-2 text-center">
                                            <input
                                                type="number"
                                                min={0}
                                                className="w-full bg-transparent outline-none text-center"
                                                value={row.quantity}
                                                onChange={(e) =>
                                                    changeQty(
                                                        row.rowId,
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </td>
                                        <td className="px-2 text-right font-medium">
                                            {formatMoney(row.total)}
                                        </td>
                                        <td className="px-2 text-center">
                                            <button
                                                type="button"
                                                title="Xóa dòng"
                                                onClick={() => deleteRow(row.rowId)}
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

                                <tr className="h-10 bg-white">
                                    <td
                                        colSpan={6}
                                        className="px-2 text-center font-bold"
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
                                            Chưa có sản phẩm nào.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* ======================================================================
                       HỢP ĐỒNG & SỞ CỨ
                    ====================================================================== */}
                    <div className="grid grid-cols-2 gap-6">
                        {/* Hợp đồng */}
                        <div className="border-2 border-gray-400 rounded p-4 bg-gray-50">
                            <h3 className="font-semibold mb-3">Hợp đồng</h3>

                            <label className="block text-sm mb-1">Nội dung</label>
                            <input
                                className="w-full border rounded px-3 py-1.5 mb-3"
                                value={contractContent}
                                onChange={(e) =>
                                    setContractContent(e.target.value)
                                }
                            />

                            <label className="block text-sm mb-1">
                                Hình ảnh hợp đồng
                            </label>
                            <div className="flex items-center gap-3 mb-2">
                                <button
                                    type="button"
                                    onClick={() => fileRef.current?.click()}
                                    className="px-3 py-1.5 text-sm rounded bg-blue-600 text-white hover:bg-blue-700"
                                >
                                    Chọn ảnh từ máy
                                </button>
                                <input
                                    ref={fileRef}
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleUploadImages}
                                />
                            </div>

                            {attachmentImages.length > 0 && (
                                <div className="space-y-2 mt-2">
                                    {attachmentImages.map((img, idx) => {
                                        const url = buildImageUrl(img);
                                        return (
                                            <div key={`${img}-${idx}`}>
                                                <p className="text-xs text-gray-600 break-all">
                                                    Ảnh {idx + 1}:{' '}
                                                    <span className="font-mono">
                                                        {img}
                                                    </span>
                                                </p>
                                                {url && (
                                                    <img
                                                        src={url}
                                                        alt={`Hợp đồng ${idx + 1}`}
                                                        className="mt-1 max-h-40 border rounded bg-white object-contain"
                                                    />
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Sở cứ */}
                        <div className="border-2 border-gray-400 rounded p-4 bg-gray-50">
                            <h3 className="font-semibold mb-3">Sở cứ</h3>
                            <label className="block text-sm mb-1">Nội dung</label>
                            <textarea
                                className="w-full border rounded px-3 py-1.5 h-32"
                                value={evidenceContent}
                                onChange={(e) =>
                                    setEvidenceContent(e.target.value)
                                }
                            />
                        </div>
                    </div>

                    {/* ======================================================================
                       LỖI + NÚT
                    ====================================================================== */}
                    {error && (
                        <div className="text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded">
                            {error}
                        </div>
                    )}

                    <div className="flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={() =>
                                router.push(
                                    '/dashboard/products/import/import-receipts',
                                )
                            }
                            className="px-8 py-2.5 rounded bg-red-600 text-white font-semibold hover:bg-red-700"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="px-8 py-2.5 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-60"
                        >
                            {saving ? 'Đang lưu…' : 'Cập nhật phiếu nhập'}
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
}

/* ============================================================
   COMPONENT PHỤ: INFO LINE
============================================================ */
interface InfoLineProps {
    label: string;
    value?: string;
    multi?: boolean;
    children?: ReactNode;
}

function InfoLine({ label, value, multi, children }: InfoLineProps) {
    return (
        <div className="flex gap-3 items-start">
            <label className="w-32 pt-1">{label}</label>
            <div className="flex-1">
                {children ? (
                    children
                ) : multi ? (
                    <textarea
                        readOnly
                        value={value ?? ''}
                        className="w-full border rounded px-3 py-1.5 h-16 bg-gray-100"
                    />
                ) : (
                    <input
                        readOnly
                        value={value ?? ''}
                        className="w-full border rounded px-3 py-1.5 bg-gray-100"
                    />
                )}
            </div>
        </div>
    );
}
