'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/src/app/components/layout/Header';
import Sidebar from '@/src/app/components/layout/Sidebar';

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

export default function CreateInventoryCheck() {
    const router = useRouter();
    const [products, setProducts] = useState<ProductItem[]>([
        { id: 1, name: 'ĐT Samsung Galaxy Z', code: 'BBXXXX', unit: 'Cái', price: '28.000.000', systemQty: '20', actualQty: '', difference: '0', note: '' },
    ]);

    const deleteProduct = (id: number) => {
        setProducts(products.filter(p => p.id !== id));
    };

    return (
        <div className="min-h-screen">
            <Header />
            <Sidebar />

            <main className="ml-[377px] mt-[113px] p-6 pr-12">
                {/* Action Button */}
                <div className="flex justify-end mb-6">
                    <button className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg font-bold text-sm shadow-lg transition-all">
                        + Thêm hàng<br />từ hệ thống
                    </button>
                </div>

                {/* Main Form */}
                <div className="bg-white rounded-lg shadow-2xl p-8">
                    <h2 className="text-xl font-bold text-center mb-6">BIÊN BẢN KIỂM KÊ HÀNG HÓA</h2>

                    {/* Thông tin chung */}
                    <div className="border-4 border-blue-600 bg-gray-100 p-6 mb-6 rounded">
                        <h3 className="text-base font-bold mb-4">Thông tin chung</h3>

                        <div className="grid grid-cols-2 gap-x-12 gap-y-4">
                            <div className="flex items-center gap-3">
                                <label className="w-32 text-sm">Lý do kiểm kê</label>
                                <div className="flex-1 relative">
                                    <select className="w-full px-3 py-1.5 border border-blue-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white">
                                        <option>Chọn lý do</option>
                                        <option>Kiểm kê định kỳ</option>
                                        <option>Kiểm kê đột xuất</option>
                                    </select>
                                    <svg className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <label className="w-32 text-sm">Mã biên bản</label>
                                <div className="flex-1 relative">
                                    <select className="w-full px-3 py-1.5 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-gray-200">
                                        <option>Tự động tạo</option>
                                    </select>
                                    <svg className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <label className="w-32 text-sm pt-2">Mô tả</label>
                                <textarea
                                    className="flex-1 px-3 py-2 border border-blue-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 h-14 resize-none"
                                ></textarea>
                            </div>

                            <div className="flex items-center gap-3">
                                <label className="w-32 text-sm">Kho kiểm kê</label>
                                <div className="flex-1 relative">
                                    <select className="w-full px-3 py-1.5 border border-blue-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white">
                                        <option>Kho tổng</option>
                                    </select>
                                    <svg className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Product Table */}
                    <div className="border-4 border-gray-400 mb-6 overflow-hidden">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-[#0046ff] text-white h-12">
                                    <th className="px-2 text-center font-bold text-sm">STT</th>
                                    <th className="px-2 text-center font-bold text-sm">Tên hàng hóa</th>
                                    <th className="px-2 text-center font-bold text-sm">Mã hàng</th>
                                    <th className="px-2 text-center font-bold text-sm">Đơn vị tính</th>
                                    <th className="px-2 text-center font-bold text-sm">Đơn giá</th>
                                    <th className="px-2 text-center font-bold text-sm">SL Hệ thống</th>
                                    <th className="px-2 text-center font-bold text-sm">SL Thực tế</th>
                                    <th className="px-2 text-center font-bold text-sm">Chênh lệch</th>
                                    <th className="px-2 text-center font-bold text-sm">Ghi chú</th>
                                    <th className="px-2 text-center font-bold text-sm">Xóa</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product) => (
                                    <tr key={product.id} className="border border-gray-400 h-12 hover:bg-gray-50">
                                        <td className="px-2 text-center text-sm border-r border-gray-400">{product.id}</td>
                                        <td className="px-2 text-right text-sm border-r border-gray-400">{product.name}</td>
                                        <td className="px-2 text-center text-sm border-r border-gray-400">{product.code}</td>
                                        <td className="px-2 text-center text-sm border-r border-gray-400">{product.unit}</td>
                                        <td className="px-2 text-right text-sm border-r border-gray-400">{product.price}</td>
                                        <td className="px-2 text-center text-sm border-r border-gray-400">{product.systemQty}</td>
                                        <td className="px-2 text-center text-sm border-r border-gray-400">
                                            <input type="text" className="w-full text-center border-0 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                                        </td>
                                        <td className="px-2 text-center text-sm border-r border-gray-400">{product.difference}</td>
                                        <td className="px-2 text-center text-sm border-r border-gray-400">
                                            <input type="text" className="w-full text-center border-0 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                                        </td>
                                        <td className="px-2 text-center border-r border-gray-400">
                                            <button
                                                onClick={() => deleteProduct(product.id)}
                                                className="hover:scale-110 transition-transform"
                                            >
                                                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                                                    <path d="M3 6H19M8 6V4C8 3.44772 8.44772 3 9 3H13C13.5523 3 14 3.44772 14 4V6M17 6V18C17 18.5523 16.5523 19 16 19H6C5.44772 19 5 18.5523 5 18V6H17Z" stroke="#f90606" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                <tr className="border border-gray-400 h-12 bg-white">
                                    <td colSpan={10} className="px-2 text-center font-bold text-sm">Tổng</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-6">
                        <button
                            onClick={() => router.back()}
                            className="px-8 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-sm shadow-lg transition-colors"
                        >
                            Hủy
                        </button>
                        <button className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-sm shadow-lg transition-colors">
                            Lưu
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}
