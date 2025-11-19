'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';


interface ProductItem {
    id: number;
    name: string;
    code: string;
    unit: string;
    price: string;
    quantity: string;
    discount: string;
    total: string;
}

export default function CreateInternalExportOrder() {
    const router = useRouter();
    const [products, setProducts] = useState<ProductItem[]>([
        { id: 1, name: 'ĐT Samsung Galaxy Z', code: 'XXXXX', unit: 'Cái', price: '30.000.000', quantity: '10', discount: '5%', total: '285.000.000' },
        { id: 2, name: 'ĐT Xiaomi Redmi 10', code: 'XXXXX', unit: 'Cái', price: '3.998.000', quantity: '10', discount: '', total: '39.980.000' },
        { id: 3, name: 'ĐT Iphone 13 Promax', code: 'XXXXX', unit: 'Cái', price: '40.000.000', quantity: '5', discount: '5%', total: '78.154.168' },
        { id: 4, name: 'Tai nghe Xiaomi', code: 'XXXXX', unit: 'Cái', price: '200.000', quantity: '4', discount: '', total: '800.000' },
        { id: 5, name: 'Tai nghe Oppo Renco', code: 'XXXXX', unit: 'Cái', price: '790.000', quantity: '', discount: '', total: '' },
    ]);

    const calculateTotal = () => {
        return products.reduce((sum, item) => {
            const total = item.total ? parseInt(item.total.replace(/\./g, '')) : 0;
            return sum + total;
        }, 0).toLocaleString('vi-VN');
    };

    const deleteProduct = (id: number) => {
        setProducts(products.filter(p => p.id !== id));
    };

    return (
        <div className="min-h-screen">
            <Header />
            <Sidebar />

            <main className="ml-[377px] mt-[113px] p-6 pr-12">
                {/* Action Buttons */}
                <div className="flex gap-4 mb-6">
                    <button className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg font-bold text-sm shadow-lg transition-all">
                        + Thêm hàng<br />từ hệ thống
                    </button>
                    <button className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg font-bold text-sm shadow-lg transition-all">
                        + Thêm hàng<br />từ file ngoài
                    </button>
                </div>

                {/* Main Form */}
                <div className="bg-white rounded-lg shadow-2xl p-8">
                    <h2 className="text-xl font-bold text-center mb-6">LỆNH XUẤT KHO</h2>

                    {/* Thông tin chung - Simplified */}
                    <div className="border-4 border-blue-600 bg-gray-100 p-6 mb-6 rounded">
                        <h3 className="text-base font-bold mb-4">Thông tin chung</h3>

                        <div className="grid grid-cols-2 gap-x-12 gap-y-4">
                            {/* Left Column */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <label className="w-28 text-sm">Người nhận</label>
                                    <div className="flex-1 relative">
                                        <select className="w-full px-3 py-1.5 border border-blue-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white">
                                            <option>Bộ phận kỹ thuật</option>
                                            <option>Bộ phận kinh doanh</option>
                                            <option>Bộ phận marketing</option>
                                        </select>
                                        <svg className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <label className="w-28 text-sm">Mã nguồn</label>
                                    <div className="flex-1 relative">
                                        <select className="w-full px-3 py-1.5 border border-blue-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white">
                                            <option>Chọn mã nguồn</option>
                                        </select>
                                        <svg className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <label className="w-28 text-sm">Số điện thoại</label>
                                    <input
                                        type="text"
                                        className="flex-1 px-3 py-1.5 border border-blue-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div className="flex items-start gap-3">
                                    <label className="w-28 text-sm pt-2">Địa chỉ</label>
                                    <textarea
                                        className="flex-1 px-3 py-2 border border-blue-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 h-14 resize-none"
                                    ></textarea>
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <label className="w-28 text-sm">Mã lệnh</label>
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
                                    <label className="w-28 text-sm pt-2">Lý do xuất</label>
                                    <textarea
                                        className="flex-1 px-3 py-2 border border-blue-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 h-14 resize-none"
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Product Table */}
                    <div className="border-4 border-gray-400 mb-6 overflow-hidden">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-[#0046ff] text-white h-12">
                                    <th className="px-2 text-center font-bold text-sm w-12">STT</th>
                                    <th className="px-2 text-center font-bold text-sm w-40">Tên hàng hóa</th>
                                    <th className="px-2 text-center font-bold text-sm w-24">Mã hàng</th>
                                    <th className="px-2 text-center font-bold text-sm w-20">Đơn vị tính</th>
                                    <th className="px-2 text-center font-bold text-sm w-28">Đơn giá</th>
                                    <th className="px-2 text-center font-bold text-sm w-20">Số lượng</th>
                                    <th className="px-2 text-center font-bold text-sm w-24">Chiết khấu</th>
                                    <th className="px-2 text-center font-bold text-sm w-28">Thành tiền</th>
                                    <th className="px-2 text-center font-bold text-sm w-16">Xóa</th>
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
                                        <td className="px-2 text-center text-sm border-r border-gray-400">{product.quantity}</td>
                                        <td className="px-2 text-right text-sm border-r border-gray-400">{product.discount}</td>
                                        <td className="px-2 text-right text-sm font-medium border-r border-gray-400">{product.total}</td>
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
                                    <td colSpan={7} className="px-2 text-center font-bold text-sm border-r border-gray-400">Tổng</td>
                                    <td className="px-2 text-right font-bold text-sm border-r border-gray-400">{calculateTotal()}</td>
                                    <td className="border-r border-gray-400"></td>
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
