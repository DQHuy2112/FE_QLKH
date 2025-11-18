'use client';

import Header from '@/src/app/components/layout/Header';
import Sidebar from '@/src/app/components/layout/Sidebar';
import { useParams, useRouter } from 'next/navigation';

interface ProductItem {
    id: number;
    name: string;
    code: string;
    unit: string;
    price: string;
    systemQty: string;
    actualQty: string;
    difference: string;
    note: string;
}

const products: ProductItem[] = [
    { id: 1, name: 'ĐT Samsung Galaxy Z', code: 'BBXXXX', unit: 'Cái', price: '28.000.000', systemQty: '20', actualQty: '18', difference: '-2', note: 'Thiếu hàng' },
    { id: 2, name: 'ĐT Xiaomi Redmi 10', code: 'BBXXXX', unit: 'Cái', price: '3.998.000', systemQty: '10', actualQty: '10', difference: '0', note: '' },
];

export default function ViewInventoryCheck() {
    const params = useParams();
    const router = useRouter();

    return (
        <div className="min-h-screen">
            <Header />
            <Sidebar />

            <main className="ml-[377px] mt-[113px] p-6 pr-12 flex gap-6">
                {/* Main Content */}
                <div className="flex-1">
                    <div className="bg-white rounded-lg shadow-2xl p-8 border border-black">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-center flex-1">BIÊN BẢN KIỂM KÊ HÀNG HÓA</h2>
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
                                <div className="flex items-center gap-3">
                                    <label className="w-32 text-sm">Mã biên bản</label>
                                    <div className="flex-1 px-3 py-1.5 border border-black bg-gray-200 text-sm text-right">
                                        BKKK001234
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <label className="w-32 text-sm">Kho kiểm kê</label>
                                    <div className="flex-1 px-3 py-1.5 border border-black bg-white text-sm text-right">
                                        Kho tổng
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <label className="w-32 text-sm pt-2">Lý do</label>
                                    <div className="flex-1 px-3 py-2 border border-black bg-white text-sm text-right h-14">
                                        Kiểm kê định kỳ tháng 10/2022
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <label className="w-32 text-sm pt-2">Mô tả</label>
                                    <div className="flex-1 px-3 py-2 border border-black bg-white text-sm text-right h-14">
                                        Kiểm tra đơn kỹ thuật tháng 10/2022
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Product Table */}
                        <div className="border-4 border-gray-400 overflow-hidden">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-[#444444] text-white h-12">
                                        <th className="px-2 text-center font-bold text-sm">STT</th>
                                        <th className="px-2 text-center font-bold text-sm">Tên hàng hóa</th>
                                        <th className="px-2 text-center font-bold text-sm">Mã hàng</th>
                                        <th className="px-2 text-center font-bold text-sm">Đơn vị tính</th>
                                        <th className="px-2 text-center font-bold text-sm">Đơn giá</th>
                                        <th className="px-2 text-center font-bold text-sm">SL Hệ thống</th>
                                        <th className="px-2 text-center font-bold text-sm">SL Thực tế</th>
                                        <th className="px-2 text-center font-bold text-sm">Chênh lệch</th>
                                        <th className="px-2 text-center font-bold text-sm">Ghi chú</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((product) => (
                                        <tr key={product.id} className="border border-gray-400 h-12">
                                            <td className="px-2 text-center text-sm border-r border-gray-400">{product.id}</td>
                                            <td className="px-2 text-right text-sm border-r border-gray-400">{product.name}</td>
                                            <td className="px-2 text-center text-sm border-r border-gray-400">{product.code}</td>
                                            <td className="px-2 text-center text-sm border-r border-gray-400">{product.unit}</td>
                                            <td className="px-2 text-right text-sm border-r border-gray-400">{product.price}</td>
                                            <td className="px-2 text-center text-sm border-r border-gray-400">{product.systemQty}</td>
                                            <td className="px-2 text-center text-sm border-r border-gray-400">{product.actualQty}</td>
                                            <td className="px-2 text-center text-sm border-r border-gray-400 font-bold">{product.difference}</td>
                                            <td className="px-2 text-center text-sm border-r border-gray-400">{product.note}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Timeline Sidebar */}
                <div className="w-[274px] bg-gray-100 rounded-lg p-5 shadow-lg h-fit">
                    <h3 className="text-base font-bold mb-4">Tình trạng</h3>

                    <div className="space-y-6">
                        {/* Tạo bởi */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm">Tạo bởi</span>
                                <div className="flex items-center gap-2 px-2 py-1.5 bg-[#ffc19e] rounded-lg shadow text-sm">
                                    <span>Xóa</span>
                                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                        <path d="M9 1L9 17M9 1L5 5M9 1L13 5" stroke="#000" strokeWidth="2" strokeLinecap="round" />
                                    </svg>
                                </div>
                            </div>
                            <div className="px-3 py-2 bg-gray-200 border border-gray-400 text-sm text-right">Nguyễn Văn A</div>
                            <div className="px-3 py-1.5 bg-gray-200 border border-gray-400 text-sm text-right">26/10/2022  15:30</div>
                        </div>

                        {/* Duyệt bởi */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm">Duyệt bởi</span>
                                <div className="flex items-center gap-2 px-2 py-1.5 bg-[#ffbc16] rounded-lg shadow text-sm">
                                    <span>Duyệt</span>
                                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                        <path d="M4 9L8 13L14 5" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            </div>
                            <div className="px-3 py-2 bg-white border border-gray-400 h-8"></div>
                            <div className="px-3 py-1.5 bg-white border border-gray-400 h-7"></div>
                        </div>

                        {/* Từ chối bởi */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm">Từ chối bởi</span>
                                <div className="flex items-center gap-2 px-2 py-1.5 bg-[#ee4b3d] rounded-lg shadow text-sm text-white">
                                    <span>Từ chối</span>
                                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                        <path d="M5 5L13 13M5 13L13 5" stroke="white" strokeWidth="2" strokeLinecap="round" />
                                    </svg>
                                </div>
                            </div>
                            <div className="px-3 py-2 bg-white border border-gray-400 h-8"></div>
                            <div className="px-3 py-1.5 bg-white border border-gray-400 h-7"></div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
