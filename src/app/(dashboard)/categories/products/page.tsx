'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/src/app/components/layout/Header';
import Sidebar from '@/src/app/components/layout/Sidebar';

interface Product {
    id: number;
    name: string;
    code: string;
    category: string;
    unit: string;
    price: string;
}

const mockData: Product[] = [
    { id: 1, name: 'ĐT Samsung Galaxy', code: 'XXXXX', category: 'Điện thoại', unit: 'Cái', price: '30.000.000' },
    { id: 2, name: 'ĐT Sam Sung S7', code: 'XXXXX', category: 'Điện thoại', unit: 'Cái', price: '2929.000.000' },
    { id: 3, name: 'ĐT Redmi 8X', code: 'XXXXX', category: 'Điện thoại', unit: 'Cái', price: '30.000.000' },
    { id: 4, name: 'ĐT Oppo Crano 5', code: 'XXXXX', category: 'Điện thoại', unit: 'Cái', price: '30.000.000' },
    { id: 5, name: 'ĐT Oppo Creno X5', code: 'XXXXX', category: 'Điện thoại', unit: 'Cái', price: '30.000.000' },
    { id: 6, name: 'ĐT Oppo Christmas', code: 'XXXXX', category: 'Điện thoại', unit: 'Cái', price: '30.000.000' },
    { id: 7, name: 'Tai nghe Iphone', code: 'XXXXX', category: 'Tai nghe', unit: 'Cái', price: '30.000.000' },
    { id: 8, name: 'Tai nghe Bluetooth Trure', code: 'XXXXX', category: 'Tai nghe', unit: 'Cái', price: '30.000.000' },
    { id: 9, name: 'Tai nghe Vivo Air', code: 'XXXXX', category: 'Tai nghe', unit: 'Cái', price: '30.000.000' },
    { id: 10, name: 'Tai nghe Gaming Asus', code: 'XXXXX', category: 'Tai nghe', unit: 'Cái', price: '30.000.000' },
    { id: 11, name: 'Cáp sạc Lighting không dây', code: 'XXXXX', category: 'Cáp sạc - Củ sạc', unit: 'Cái', price: '30.000.000' },
    { id: 12, name: 'Cáp sạc USB', code: 'XXXXX', category: 'Cáp sạc - Củ sạc', unit: 'Cái', price: '30.000.000' },
    { id: 13, name: 'Củ sạc nhanh XXX', code: 'XXXXX', category: 'Cáp sạc - Củ sạc', unit: 'Cái', price: '30.000.000' },
];

export default function QuanLyHangHoa() {
    const router = useRouter();
    const [data] = useState<Product[]>(mockData);

    return (
        <div className="min-h-screen">
            <Header />
            <Sidebar />

            <main className="ml-[377px] mt-[113px] p-6 pr-12">
                {/* Filter Section */}
                <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        {/* Mã hàng hóa */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Mã hàng hóa</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Nhập mã hàng hóa"
                            />
                        </div>

                        {/* Tên hàng hóa */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Tên hàng hóa</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Nhập tên hàng hóa"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                        {/* Từ ngày */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Từ ngày</label>
                            <div className="relative">
                                <input
                                    type="date"
                                    className="w-full px-4 py-2 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth="2" />
                                    <line x1="16" y1="2" x2="16" y2="6" strokeWidth="2" strokeLinecap="round" />
                                    <line x1="8" y1="2" x2="8" y2="6" strokeWidth="2" strokeLinecap="round" />
                                    <line x1="3" y1="10" x2="21" y2="10" strokeWidth="2" />
                                </svg>
                            </div>
                        </div>

                        {/* Đến ngày */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Đến ngày</label>
                            <div className="relative">
                                <input
                                    type="date"
                                    className="w-full px-4 py-2 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth="2" />
                                    <line x1="16" y1="2" x2="16" y2="6" strokeWidth="2" strokeLinecap="round" />
                                    <line x1="8" y1="2" x2="8" y2="6" strokeWidth="2" strokeLinecap="round" />
                                    <line x1="3" y1="10" x2="21" y2="10" strokeWidth="2" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3">
                        <button className="px-6 py-2 bg-[#97a2ff] hover:bg-[#8591ff] text-black rounded-md transition-colors flex items-center gap-2">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="2" />
                                <path d="M11 11L14 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                            Tìm kiếm
                        </button>
                        <button
                            onClick={() => router.push('/dashboard/categories/products/create')}
                            className="px-6 py-2 bg-[#0046ff] hover:bg-[#0039cc] text-white rounded-lg transition-colors flex items-center gap-2 shadow-lg"
                        >
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M8 3V13M3 8H13" stroke="white" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                            Thêm hàng hóa
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-[#0046ff] text-white">
                                <tr className="h-[48px]">
                                    <th className="px-4 text-center font-bold text-sm">STT</th>
                                    <th className="px-4 text-center font-bold text-sm">Tên hàng</th>
                                    <th className="px-4 text-center font-bold text-sm">Mã hàng</th>
                                    <th className="px-4 text-center font-bold text-sm">Nhóm hàng</th>
                                    <th className="px-4 text-center font-bold text-sm">Đơn vị tính</th>
                                    <th className="px-4 text-center font-bold text-sm">Đơn giá</th>
                                    <th className="px-4 text-center font-bold text-sm">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((product) => (
                                    <tr key={product.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors h-[48px]">
                                        <td className="px-4 text-center text-sm">{product.id}</td>
                                        <td className="px-4 text-center text-sm">{product.name}</td>
                                        <td className="px-4 text-center text-sm">{product.code}</td>
                                        <td className="px-4 text-center text-sm">{product.category}</td>
                                        <td className="px-4 text-center text-sm">{product.unit}</td>
                                        <td className="px-4 text-center text-sm">{product.price}</td>
                                        <td className="px-4">
                                            <div className="flex items-center justify-center gap-3">
                                                <button
                                                    onClick={() => router.push(`/dashboard/categories/products/edit/${product.id}`)}
                                                    className="hover:scale-110 transition-transform"
                                                    title="Chỉnh sửa"
                                                >
                                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                        <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="#0046ff" strokeWidth="2" strokeLinecap="round" />
                                                        <path d="M18.5 2.5C18.8978 2.10217 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10217 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10217 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="#0046ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </button>
                                                <button className="hover:scale-110 transition-transform" title="Xóa">
                                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                        <path d="M3 6H21M5 6V20C5 21.1046 5.89543 22 7 22H17C18.1046 22 19 21.1046 19 20V6M8 6V4C8 2.89543 8.89543 2 10 2H14C15.1046 2 16 2.89543 16 4V6" stroke="#ee4b3d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}
