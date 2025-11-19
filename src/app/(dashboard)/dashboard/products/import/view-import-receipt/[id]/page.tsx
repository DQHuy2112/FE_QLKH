/* eslint-disable @next/next/no-img-element */
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';

import {
    getSupplierImportById,
    type SupplierImport,
    type SupplierImportDetail,
} from '@/services/inventory.service';

import { getSuppliers, type Supplier } from '@/services/supplier.service';
import { getProduct } from '@/services/product.service';

const API_BASE =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8080';

function buildImageUrl(path: string | null | undefined) {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    const clean = path.startsWith('/') ? path : `/${path}`;
    return `${API_BASE}${clean}`;
}

export default function ViewImportReceipt() {
    const params = useParams();
    const router = useRouter();

    const rawId = Array.isArray(params?.id) ? params.id[0] : params?.id;
    const id = Number(rawId);

    const [data, setData] = useState<SupplierImport | null>(null);
    const [items, setItems] = useState<SupplierImportDetail[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        (async () => {
            try {
                setLoading(true);

                // Lấy NCC + phiếu nhập song song
                const [suppliers, importData] = await Promise.all([
                    getSuppliers(),
                    getSupplierImportById(id),
                ]);

                // ---- map lại thông tin NCC ----
                const sp = suppliers.find(
                    (s: Supplier) => s.id === importData.supplierId,
                );

                const mappedImport: SupplierImport = {
                    ...importData,
                    supplierName: sp?.name ?? importData.supplierName ?? null,
                    supplierCode: sp?.code ?? importData.supplierCode ?? null,
                    supplierPhone: sp?.phone ?? importData.supplierPhone ?? null,
                    supplierAddress: sp?.address ?? importData.supplierAddress ?? null,
                };

                setData(mappedImport);

                // ---- DEBUG: Kiểm tra dữ liệu từ API ----
                console.log('🔍 Import Data:', importData);

                // ---- map lại danh sách sản phẩm ----
                const rawItems = importData.items || [];

                console.log('🔍 Raw Items:', rawItems);

                // ⭐ Fetch thông tin sản phẩm cho từng item
                const mappedItems: SupplierImportDetail[] = await Promise.all(
                    rawItems.map(async (it: any) => {
                        let productCode = '';
                        let productName = '';
                        let unit = 'Cái';

                        // Nếu đã có sẵn thông tin sản phẩm từ BE
                        if (it.productCode && it.productName) {
                            productCode = it.productCode;
                            productName = it.productName;
                            unit = it.unit || 'Cái';
                        }
                        // Nếu chỉ có productId, gọi API để lấy thông tin
                        else if (it.productId) {
                            try {
                                const product = await getProduct(it.productId);
                                productCode = product.code;
                                productName = product.name;
                                unit = 'Cái'; // Hoặc lấy từ product nếu có field unit
                            } catch (err) {
                                console.error('Failed to fetch product:', it.productId, err);
                                // Fallback: hiển thị productId nếu không fetch được
                                productCode = `ID: ${it.productId}`;
                                productName = `Sản phẩm #${it.productId}`;
                            }
                        }

                        return {
                            ...it,
                            productCode,
                            productName,
                            unit,
                            unitPrice: it.unitPrice ?? it.price ?? 0,
                            quantity: it.quantity ?? 0,
                        };
                    })
                );

                console.log('🔍 Mapped Items:', mappedItems);
                setItems(mappedItems);
            } catch (err: unknown) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        })();
    }, [id]);

    if (loading) {
        return (
            <div className="ml-[377px] mt-[150px] text-xl">
                Đang tải...
            </div>
        );
    }

    if (!data) {
        return (
            <div className="ml-[377px] mt-[150px] text-xl text-red-600">
                Không tìm thấy phiếu nhập
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <Header />
            <Sidebar />

            <main className="ml-[377px] mt-[113px] p-6 pr-12 flex gap-6">
                <div className="flex-1">
                    <div className="bg-white rounded-lg shadow-2xl p-8 border border-black">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold flex-1 text-center">
                                PHIẾU NHẬP KHO (NCC)
                            </h2>

                            <button
                                onClick={() => router.back()}
                                className="text-2xl font-bold hover:text-red-600 transition"
                            >
                                X
                            </button>
                        </div>

                        {/* THÔNG TIN CHUNG */}
                        <div className="border border-black bg-gray-100 p-6 mb-6 rounded">
                            <h3 className="font-bold mb-4">Thông tin chung</h3>

                            <div className="grid grid-cols-2 gap-x-12 gap-y-4">
                                <div className="space-y-4">
                                    <InfoRow label="Nguồn nhập" value={data.supplierName} />
                                    <InfoRow label="Mã nguồn" value={data.supplierCode} />
                                    <InfoRow label="Số điện thoại" value={data.supplierPhone} />
                                    <InfoRow
                                        label="Địa chỉ"
                                        value={data.supplierAddress}
                                        multi
                                    />
                                </div>

                                <div className="space-y-4">
                                    <InfoRow label="Mã phiếu" value={data.code} />
                                    <InfoRow label="Nhập tại kho" value="Kho tổng" />
                                    <InfoRow label="Mã kho" value="KT_001" />
                                    <InfoRow label="Lý do nhập" value={data.note} multi />
                                </div>
                            </div>
                        </div>

                        {/* BẢNG SẢN PHẨM */}
                        <div className="border-4 border-gray-400 mb-6 overflow-hidden rounded">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-[#0046ff] text-white h-10">
                                        <th className="px-2 w-12">STT</th>
                                        <th className="px-2 w-40">Tên hàng hóa</th>
                                        <th className="px-2 w-28">Mã hàng</th>
                                        <th className="px-2 w-20">ĐVT</th>
                                        <th className="px-2 w-28">Đơn giá</th>
                                        <th className="px-2 w-20">SL</th>
                                        <th className="px-2 w-28">Thành tiền</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {items.length === 0 ? (
                                        <tr className="border-t h-10">
                                            <td colSpan={7} className="text-center text-gray-500 py-4">
                                                Không có sản phẩm nào
                                            </td>
                                        </tr>
                                    ) : (
                                        items.map((it, i) => (
                                            <tr key={i} className="border-t h-10">
                                                <td className="text-center">{i + 1}</td>
                                                <td className="px-2">{it.productName}</td>
                                                <td className="text-center">{it.productCode}</td>
                                                <td className="text-center">{it.unit ?? 'Cái'}</td>
                                                <td className="text-right">
                                                    {Number(it.unitPrice).toLocaleString('vi-VN')}
                                                </td>
                                                <td className="text-center">{it.quantity}</td>
                                                <td className="text-right font-medium">
                                                    {(Number(it.unitPrice) * it.quantity).toLocaleString(
                                                        'vi-VN',
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )}

                                    <tr className="bg-gray-100 font-bold h-10 border-t">
                                        <td colSpan={6} className="text-center">
                                            Tổng
                                        </td>
                                        <td className="text-right px-4">
                                            {data.totalValue.toLocaleString('vi-VN')}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* HÌNH ẢNH */}
                        <div className="border border-black bg-gray-100 p-6 rounded">
                            <h3 className="font-bold mb-4">
                                Hợp đồng / Ảnh đính kèm
                            </h3>

                            <div className="flex gap-4 flex-wrap">
                                {(!data.attachmentImages ||
                                    data.attachmentImages.length === 0) && (
                                        <p className="text-gray-600">Không có ảnh</p>
                                    )}

                                {data.attachmentImages?.map((img, idx) => {
                                    const url = buildImageUrl(img);
                                    return (
                                        <div
                                            key={idx}
                                            className="w-[180px] h-[240px] bg-white border rounded shadow flex items-center justify-center"
                                        >
                                            {url ? (
                                                <img
                                                    src={url}
                                                    className="w-full h-full object-contain"
                                                    alt={`Ảnh ${idx + 1}`}
                                                />
                                            ) : (
                                                <span>No Image</span>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                <StatusSidebar data={data} />
            </main>
        </div>
    );
}

/* ---------- COMPONENTS ---------- */
interface InfoRowProps {
    label: string;
    value?: string | null;
    multi?: boolean;
}

function InfoRow({ label, value, multi = false }: InfoRowProps) {
    return (
        <div className="flex items-start gap-3">
            <label className="w-28 text-sm pt-1">{label}</label>
            <div
                className={`flex-1 px-3 py-1.5 border border-black bg-white text-sm text-right ${multi ? 'h-14' : ''
                    }`}
            >
                {value ?? ''}
            </div>
        </div>
    );
}

function StatusSidebar({ data }: { data: SupplierImport }) {
    return (
        <div className="w-[274px] bg-gray-100 rounded-lg p-5 shadow-lg h-fit">
            <h3 className="text-base font-bold mb-4">Tình trạng</h3>

            <div className="space-y-6">
                <div>
                    <p className="text-sm font-medium">Tạo lúc:</p>
                    <div className="px-3 py-2 bg-white border">
                        {new Date(data.importsDate).toLocaleString('vi-VN')}
                    </div>
                </div>

                <div>
                    <p className="text-sm font-medium">Trạng thái:</p>
                    <div className="px-3 py-2 bg-white border">{data.status}</div>
                </div>
            </div>
        </div>
    );
}
