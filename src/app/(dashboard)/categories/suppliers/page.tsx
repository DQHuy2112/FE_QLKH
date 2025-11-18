'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/src/app/components/layout/Header';
import Sidebar from '@/src/app/components/layout/Sidebar';

interface Supplier {
    id: number;
    name: string;
    type: string;
    code: string;
    phone: string;
    address: string;
}

const mockData: Supplier[] = [
    { id: 1, name: 'Nhà cung cấp A', type: 'Nhà cung cấp', code: 'XXXXXX', phone: '12345678', address: '37 Cộng Hòa, Tân Bình, TPHCM' },
    { id: 2, name: 'Nhà cung cấp C', type: 'Nhà cung cấp', code: 'XXXXXX', phone: '68765843', address: '1 Tân Hương, Tân Phú, TPHCM' },
    { id: 3, name: 'Kho tổng', type: 'Kho tổng', code: 'XXXXXX', phone: '213149812', address: '37 Nghĩa Đệ, Cầu Giấy, HN' },
    { id: 4, name: 'Đại lý MM', type: 'Đại lý cấp 2', code: 'XXXXXX', phone: '132132567', address: '37 Nghĩa Đệ, Cầu Giấy, HN' },
    { id: 5, name: 'Nhà cung cấp A', type: 'Nhà cung cấp', code: 'XXXXXX', phone: '879789879', address: '1 Tân Hương, Tân Phú, TPHCM' },
    { id: 6, name: 'Đại lý G', type: 'Đại lý cấp 2', code: 'XXXXXX', phone: '875875855', address: '1 Tân Hương, Tân Phú, TPHCM' },
    { id: 7, name: 'Nhà cung cấp E', type: 'Nhà cung cấp', code: 'XXXXXX', phone: '312312323', address: '37 Quan Hoa, Cầu Giấy, HN' },
    { id: 8, name: 'Đại lý V', type: 'Đại lý cấp 1', code: 'XXXXXX', phone: '89899868', address: '37 Nhổn, Nam Từ Liêm, HN' },
    { id: 9, name: 'Đại lý D', type: 'Đại lý cấp 1', code: 'XXXXXX', phone: '95451555', address: '37 Tây Hồ, Tây Hồ, HN' },
    { id: 10, name: 'Đại lý C', type: 'Đại lý cấp 1', code: 'XXXXXX', phone: '94518548', address: '37 Cộng Hòa,Tân Bình, TPHCM' },
    { id: 11, name: 'Hoàng Minh Anh', type: 'NVBH', code: 'XXXXXX', phone: '217751839', address: '23 Mỹ Đình, Nam Từ Liêm, HN' },
    { id: 12, name: 'Đại lý A', type: 'Đại lý 2', code: 'XXXXXX', phone: '39668415', address: '37 Quan Hoa, Cầu Giấy, HN' },
    { id: 13, name: 'Đại lý F', type: 'Đại lý 1', code: 'XXXXXX', phone: '21159984', address: '37 Nhổn, Nam Từ Liêm, HN' },
];

export default function QuanLyNguonHang() {
    const router = useRouter();
    const [data] = useState<Supplier[]>(mockData);
    const [searchCode, setSearchCode] = useState('');
    const [searchName, setSearchName] = useState('');
    const [searchType, setSearchType] = useState('');

    return (
        <div className="min-h-screen">
            <Header />
            <Sidebar />

            <main className="ml-[377px] mt-[113px] p-6 pr-12">
                {/* Filter Section */}
                <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                    <div className="grid grid-cols-3 gap-4 mb-4">
                        {/* Mã nguồn */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Mã nguồn</label>
                            <input
                                type="text"
                                value={searchCode}
                                onChange={(e) => setSearchCode(e.target.value)}
                                className="w-full px-4 py-2 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Nhập mã nguồn"
                            />
                        </div>

                        {/* Tên nguồn */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Tên nguồn</label>
                            <input
                                type="text"
                                value={searchName}
                                onChange={(e) => setSearchName(e.target.value)}
                                className="w-full px-4 py-2 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Nhập tên nguồn"
                            />
                        </div>

                        {/* Loại nguồn */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Loại nguồn</label>
                            <div className="relative">
                                <select
                                    value={searchType}
                                    onChange={(e) => setSearchType(e.target.value)}
                                    className="w-full px-4 py-2 bg-gray-100 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Tất cả</option>
                                    <option>Nhà cung cấp</option>
                                    <option>Đại lý cấp 1</option>
                                    <option>Đại lý cấp 2</option>
                                    <option>NVBH</option>
                                    <option>Kho tổng</option>
                                </select>
                                <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                        <input
                            type="text"
                            className="flex-1 px-4 py-2 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Nhập số điện thoại"
                        />
                    </div>

                    <div className="flex justify-end gap-3 mt-4">
                        <button className="px-6 py-2 bg-[#97a2ff] hover:bg-[#8591ff] text-black rounded-md transition-colors flex items-center gap-2">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="2" />
                                <path d="M11 11L14 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                            Tìm kiếm
                        </button>
                        <button
                            onClick={() => router.push('/dashboard/categories/suppliers/create')}
                            className="px-6 py-2 bg-[#0046ff] hover:bg-[#0039cc] text-white rounded-lg transition-colors flex items-center gap-2 shadow-lg"
                        >
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M8 3V13M3 8H13" stroke="white" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                            Thêm mới nguồn
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
                                    <th className="px-4 text-center font-bold text-sm">Tên nguồn</th>
                                    <th className="px-4 text-center font-bold text-sm">Loại nguồn</th>
                                    <th className="px-4 text-center font-bold text-sm">Mã nguồn</th>
                                    <th className="px-4 text-center font-bold text-sm">Số điện thoại</th>
                                    <th className="px-4 text-center font-bold text-sm">Địa chỉ</th>
                                    <th className="px-4 text-center font-bold text-sm">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((supplier) => (
                                    <tr key={supplier.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors h-[48px]">
                                        <td className="px-4 text-center text-sm">{supplier.id}</td>
                                        <td className="px-4 text-center text-sm">{supplier.name}</td>
                                        <td className="px-4 text-center text-sm">{supplier.type}</td>
                                        <td className="px-4 text-center text-sm">{supplier.code}</td>
                                        <td className="px-4 text-center text-sm">{supplier.phone}</td>
                                        <td className="px-4 text-center text-sm">{supplier.address}</td>
                                        <td className="px-4">
                                            <div className="flex items-center justify-center">
                                                <button className="w-8 h-8 bg-red-500 rounded flex items-center justify-center hover:bg-red-600 transition-colors">
                                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                        <path d="M3 4H13M5 4V3C5 2.44772 5.44772 2 6 2H10C10.5523 2 11 2.44772 11 3V4M12 4V13C12 13.5523 11.5523 14 11 14H5C4.44772 14 4 13.5523 4 13V4H12Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
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
