'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import { getInternalExportById, confirmInternalExport, cancelInternalExport, type InternalExport, type InternalExportDetail } from '@/services/inventory.service';
import { getStore, type Store } from '@/services/store.service';
import { getProduct } from '@/services/product.service';

const formatCurrency = (value: number) => value.toLocaleString('vi-VN');
const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

// Helper function để chuyển trạng thái sang tiếng Việt
function getStatusText(status: string): string {
    const statusMap: Record<string, string> = {
        'PENDING': 'Chờ xử lý',
        'IMPORTED': 'Đã nhập',
        'EXPORTED': 'Đã xuất',
        'CANCELLED': 'Đã hủy',
        'APPROVED': 'Đã duyệt',
        'REJECTED': 'Đã từ chối',
        'RETURNED': 'Đã hoàn trả',
    };
    return statusMap[status] || status;
}

export default function ViewInternalExportReceipt() {
    const router = useRouter();
    const params = useParams();
    const id = Number(params.id);

    const [data, setData] = useState<InternalExport | null>(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        loadData();
    }, [id]);

    const loadData = async () => {
        try {
            setLoading(true);
            const result = await getInternalExportById(id);

            // Fetch thông tin kho đích nếu thiếu
            let targetStore: Store | null = null;
            if (result.targetStoreId && !result.targetStoreName) {
                try {
                    targetStore = await getStore(result.targetStoreId);
                } catch (err) {
                    console.error('Failed to fetch target store:', err);
                }
            }

            // Map lại thông tin kho đích
            const mappedExport: InternalExport = {
                ...result,
                targetStoreName: targetStore?.name ?? result.targetStoreName ?? null,
                targetStoreCode: targetStore?.code ?? result.targetStoreCode ?? null,
                targetStorePhone: targetStore?.phone ?? result.targetStorePhone ?? null,
                targetStoreAddress: targetStore?.address ?? result.targetStoreAddress ?? null,
            };

            // Fetch thông tin sản phẩm cho từng item nếu thiếu
            if (mappedExport.items && mappedExport.items.length > 0) {
                const mappedItems: InternalExportDetail[] = await Promise.all(
                    mappedExport.items.map(async (item) => {
                        if (item.productCode && item.productName) {
                            return item; // Đã có đầy đủ thông tin
                        }

                        // Fetch thông tin sản phẩm
                        try {
                            const product = await getProduct(item.productId);
                            return {
                                ...item,
                                productCode: product.code,
                                productName: product.name,
                                unit: item.unit || 'Cái',
                            };
                        } catch (err) {
                            console.error('Failed to fetch product:', item.productId, err);
                            return {
                                ...item,
                                productCode: `ID: ${item.productId}`,
                                productName: `Sản phẩm #${item.productId}`,
                            };
                        }
                    })
                );
                mappedExport.items = mappedItems;
            }

            setData(mappedExport);
        } catch (error) {
            console.error('Lỗi khi tải chi tiết phiếu xuất:', error);
            alert('Không thể tải chi tiết phiếu xuất');
        } finally {
            setLoading(false);
        }
    };

    const handleConfirm = async () => {
        if (!confirm('Xác nhận xuất kho?')) return;
        try {
            setProcessing(true);
            await confirmInternalExport(id);
            alert('Xác nhận xuất kho thành công!');
            loadData();
        } catch (error) {
            console.error('Lỗi khi xác nhận:', error);
            alert(error instanceof Error ? error.message : 'Không thể xác nhận phiếu xuất');
        } finally {
            setProcessing(false);
        }
    };

    const handleCancel = async () => {
        if (!confirm('Hủy phiếu xuất này?')) return;
        try {
            setProcessing(true);
            await cancelInternalExport(id);
            alert('Hủy phiếu xuất thành công!');
            loadData();
        } catch (error) {
            console.error('Lỗi khi hủy:', error);
            alert(error instanceof Error ? error.message : 'Không thể hủy phiếu xuất');
        } finally {
            setProcessing(false);
        }
    };

    const calculateTotal = () => {
        if (!data?.items) return 0;
        return data.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    };

    if (loading) {
        return (
            <div className="min-h-screen">
                <Header />
                <Sidebar />
                <main className="ml-[377px] mt-[113px] p-6 pr-12">
                    <div className="text-center py-8">Đang tải...</div>
                </main>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="min-h-screen">
                <Header />
                <Sidebar />
                <main className="ml-[377px] mt-[113px] p-6 pr-12">
                    <div className="text-center py-8">Không tìm thấy phiếu xuất</div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <Header />
            <Sidebar />

            <main className="ml-[377px] mt-[113px] p-6 pr-12 flex gap-6">
                {/* Main Content */}
                <div className="flex-1">
                    {/* Form */}
                    <div className="bg-white rounded-lg shadow-2xl p-8 border border-black">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-center flex-1">PHIẾU XUẤT KHO</h2>
                            <button
                                onClick={() => router.back()}
                                className="text-2xl font-bold hover:text-red-600 transition-colors"
                            >
                                X
                            </button>
                        </div>

                        {/* Thông tin chung */}
                        <div className="border border-black bg-gray-100 p-6 mb-6">
                            <h3 className="text-base font-bold mb-4">Thông tin chung</h3>

                            <div className="grid grid-cols-2 gap-x-12 gap-y-4">
                                {/* Left Column */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <label className="w-28 text-sm">Nguồn nhận</label>
                                        <div className="flex-1 px-3 py-1.5 border border-black bg-white text-sm text-right">
                                            {data.targetStoreName || 'N/A'}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <label className="w-28 text-sm">Mã nguồn</label>
                                        <div className="flex-1 px-3 py-1.5 border border-black bg-white text-sm text-right">
                                            {data.targetStoreCode || 'N/A'}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <label className="w-28 text-sm">Số điện thoại</label>
                                        <div className="flex-1 px-3 py-1.5 border border-black bg-white text-sm text-right">
                                            {data.targetStorePhone || 'N/A'}
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <label className="w-28 text-sm pt-2">Địa chỉ</label>
                                        <div className="flex-1 px-3 py-2 border border-black bg-white text-sm text-right h-14">
                                            {data.targetStoreAddress || 'N/A'}
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <label className="w-28 text-sm">Mã lệnh</label>
                                        <div className="flex-1 px-3 py-1.5 border border-black bg-gray-200 text-sm text-right">
                                            {data.code}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <label className="w-28 text-sm">Xuất tại kho</label>
                                        <div className="flex-1 px-3 py-1.5 border border-black bg-white text-sm text-right">
                                            Kho tổng
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <label className="w-28 text-sm">Mã kho</label>
                                        <div className="flex-1 px-3 py-1.5 border border-black bg-white text-sm text-right">
                                            KT_5467
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <label className="w-28 text-sm pt-2">Lý do</label>
                                        <div className="flex-1 px-3 py-2 border border-black bg-white text-sm text-right h-14">
                                            {data.note || 'N/A'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Product Table */}
                        <div className="border-4 border-gray-400 mb-6 overflow-hidden">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-[#444444] text-white h-12">
                                        <th className="px-2 text-center font-bold text-sm w-12">STT</th>
                                        <th className="px-2 text-center font-bold text-sm w-40">Tên hàng hóa</th>
                                        <th className="px-2 text-center font-bold text-sm w-24">Mã hàng</th>
                                        <th className="px-2 text-center font-bold text-sm w-20">Đơn vị tính</th>
                                        <th className="px-2 text-center font-bold text-sm w-28">Đơn giá</th>
                                        <th className="px-2 text-center font-bold text-sm w-20">Số lượng</th>
                                        <th className="px-2 text-center font-bold text-sm w-32">Thành tiền</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.items && data.items.length > 0 ? (
                                        data.items.map((item, index) => (
                                            <tr key={item.id || index} className="border border-gray-400 h-12">
                                                <td className="px-2 text-center text-sm border-r border-gray-400">{index + 1}</td>
                                                <td className="px-2 text-right text-sm border-r border-gray-400">{item.productName}</td>
                                                <td className="px-2 text-center text-sm border-r border-gray-400">{item.productCode}</td>
                                                <td className="px-2 text-center text-sm border-r border-gray-400">{item.unitName || item.unit}</td>
                                                <td className="px-2 text-right text-sm border-r border-gray-400">{formatCurrency(item.unitPrice)}</td>
                                                <td className="px-2 text-center text-sm border-r border-gray-400">{item.quantity}</td>
                                                <td className="px-2 text-right text-sm font-medium border-r border-gray-400">
                                                    {formatCurrency(item.quantity * item.unitPrice)}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={7} className="px-2 py-4 text-center text-gray-500">
                                                Không có sản phẩm
                                            </td>
                                        </tr>
                                    )}
                                    <tr className="border border-gray-400 h-12 bg-white">
                                        <td colSpan={6} className="px-2 text-center font-bold text-sm border-r border-gray-400">Tổng</td>
                                        <td className="px-2 text-right font-bold text-sm border-r border-gray-400">
                                            {formatCurrency(calculateTotal())}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* Action Buttons */}
                        {data.status === 'PENDING' && (
                            <div className="flex justify-end gap-4">
                                <button
                                    onClick={handleCancel}
                                    disabled={processing}
                                    className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg disabled:opacity-50"
                                >
                                    Hủy phiếu
                                </button>
                                <button
                                    onClick={handleConfirm}
                                    disabled={processing}
                                    className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg disabled:opacity-50"
                                >
                                    Xác nhận xuất kho
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Status Sidebar */}
                <div className="w-[274px] bg-gray-100 rounded-lg p-5 shadow-lg h-fit">
                    <h3 className="text-base font-bold mb-4">Tình trạng</h3>
                    <div className="space-y-4">
                        <div className="px-4 py-2 bg-white border border-gray-400 rounded">
                            <div className="text-sm font-bold mb-1">Trạng thái</div>
                            <div className="text-sm">{getStatusText(data.status)}</div>
                        </div>
                        <div className="px-4 py-2 bg-white border border-gray-400 rounded">
                            <div className="text-sm font-bold mb-1">Tổng giá trị</div>
                            <div className="text-sm">{formatCurrency(data.totalValue)}</div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
