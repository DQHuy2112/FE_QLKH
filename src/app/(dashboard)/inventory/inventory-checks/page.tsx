'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/src/app/components/layout/Header';
import Sidebar from '@/src/app/components/layout/Sidebar';

type CheckStatus = 'pending' | 'approved' | 'completed';

interface InventoryCheck {
    id: number;
    code: string;
    description: string;
    datetime: string;
    status: CheckStatus;
}

const mockData: InventoryCheck[] = [
    { id: 1, code: 'BKKK001234', description: 'Kiểm tra đơn kỹ thuật tháng 10/2022', datetime: '26/10/2022  15:30', status: 'pending' },
    { id: 2, code: 'BKKK001234', description: 'Kiểm tra đơn kỹ thuật tháng 10/2022', datetime: '30/10/2022  08:52', status: 'completed' },
    { id: 3, code: 'BKKK001234', description: 'Kiểm tra đơn kỹ thuật tháng 10/2022', datetime: '31/10/2022  12:03', status: 'approved' },
    { id: 4, code: 'BKKK001234', description: 'Kiểm tra đơn kỹ thuật tháng 10/2022', datetime: '28/10/2022  15:28', status: 'approved' },
    { id: 5, code: 'BKKK001234', description: 'Kiểm tra đơn kỹ thuật tháng 10/2022', datetime: '30/10/2022  04:03', status: 'approved' },
    { id: 6, code: 'BKKK001234', description: 'Kiểm tra đơn kỹ thuật tháng 10/2022', datetime: '18/10/2022  13:04', status: 'approved' },
    { id: 7, code: 'BKKK001234', description: 'Kiểm tra đơn kỹ thuật tháng 10/2022', datetime: '02/10/2022  18:38', status: 'approved' },
    { id: 8, code: 'BKKK001234', description: 'Kiểm tra đơn kỹ thuật tháng 10/2022', datetime: '13/10/2022  07:18', status: 'approved' },
    { id: 9, code: 'BKKK001234', description: 'Kiểm tra đơn kỹ thuật tháng 10/2022', datetime: '24/10/2022  18:28', status: 'approved' },
    { id: 10, code: 'BKKK001234', description: 'Kiểm tra đơn kỹ thuật tháng 10/2022', datetime: '30/10/2022  08:08', status: 'approved' },
    { id: 11, code: 'BKKK001234', description: 'Kiểm tra đơn kỹ thuật tháng 10/2022', datetime: '26/10/2022  18:28', status: 'approved' },
    { id: 12, code: 'BKKK001234', description: 'Kiểm tra đơn kỹ thuật tháng 10/2022', datetime: '20/10/2022  07:04', status: 'approved' },
    { id: 13, code: 'BKKK001234', description: 'Kiểm tra đơn kỹ thuật tháng 10/2022', datetime: '24/10/2022  18:28', status: 'approved' },
];

const statusConfig = {
    pending: { label: 'Chờ duyệt', color: 'bg-[#fcbd17]' },
    approved: { label: 'Đã duyệt', color: 'bg-[#1ea849]' },
    completed: { label: 'Từ chối', color: 'bg-[#ee4b3d]' },
};

export default function InventoryChecksPage() {
    const router = useRouter();
    const [data] = useState<InventoryCheck[]>(mockData);

    return (
        <div className="min-h-screen">
            <Header />
            <Sidebar />

            <main className="ml-[377px] mt-[113px] p-6 pr-12">
                {/* Filter Section */}
                <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                    <div className="grid grid-cols-4 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Mã biên bản</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Nhập mã"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Tình trạng</label>
                            <div className="relative">
                                <select className="w-full px-4 py-2 bg-gray-100 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    <option>Tất cả</option>
                                    <option>Chờ duyệt</option>
                                    <option>Đã duyệt</option>
                                    <option>Từ chối</option>
                                </select>
                                <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Từ ngày</label>
                            <input
                                type="date"
                                className="w-full px-4 py-2 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Đến ngày</label>
                            <input
                                type="date"
                                className="w-full px-4 py-2 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
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
                            onClick={() => router.push('/dashboard/inventory/create-inventory-check')}
                            className="px-6 py-2 bg-[#0046ff] hover:bg-[#0039cc] text-white rounded-lg transition-colors flex items-center gap-2 shadow-lg"
                        >
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M8 3V13M3 8H13" stroke="white" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                            Tạo biên bản kiểm kê
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-[#0046ff] text-white h-[48px]">
                                    <th className="px-4 text-center font-bold text-sm">STT</th>
                                    <th className="px-4 text-center font-bold text-sm">Mã biên bản</th>
                                    <th className="px-4 text-center font-bold text-sm">Mô tả</th>
                                    <th className="px-4 text-center font-bold text-sm">Thời gian</th>
                                    <th className="px-4 text-center font-bold text-sm">Tình trạng</th>
                                    <th className="px-4 text-center font-bold text-sm">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((record) => (
                                    <tr key={record.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors h-[48px]">
                                        <td className="px-4 text-center text-sm">{record.id}</td>
                                        <td className="px-4 text-center text-sm">{record.code}</td>
                                        <td className="px-4 text-center text-sm">{record.description}</td>
                                        <td className="px-4 text-center text-sm whitespace-nowrap">{record.datetime}</td>
                                        <td className="px-4 text-center">
                                            <span className={`inline-block px-4 py-1 rounded-md text-sm font-medium text-black ${statusConfig[record.status].color}`}>
                                                {statusConfig[record.status].label}
                                            </span>
                                        </td>
                                        <td className="px-4">
                                            <div className="flex items-center justify-center gap-3">
                                                <button
                                                    onClick={() => router.push(`/dashboard/inventory/view-inventory-check/${record.id}`)}
                                                    className="hover:scale-110 transition-transform"
                                                    title="Xem chi tiết"
                                                >
                                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                        <path d="M12 5C7 5 2.73 8.11 1 12.5C2.73 16.89 7 20 12 20C17 20 21.27 16.89 23 12.5C21.27 8.11 17 5 12 5Z" stroke="#0046ff" strokeWidth="2" />
                                                        <circle cx="12" cy="12.5" r="3" stroke="#0046ff" strokeWidth="2" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => router.push(`/dashboard/inventory/edit-inventory-check/${record.id}`)}
                                                    className="hover:scale-110 transition-transform"
                                                    title="Chỉnh sửa"
                                                >
                                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                        <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="#0046ff" strokeWidth="2" strokeLinecap="round" />
                                                        <path d="M18.5 2.5C18.8978 2.10217 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10217 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10217 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="#0046ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </button>
                                                <button
                                                    className="hover:scale-110 transition-transform"
                                                    title="Xóa"
                                                >
                                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                        <path d="M3 6H21M8 6V4C8 3.46957 8.44772 3 9 3H15C15.5523 3 16 3.46957 16 4V6M19 6V20C19 20.5523 18.5523 21 18 21H6C5.44772 21 5 20.5523 5 20V6H19Z" stroke="#ee4b3d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
