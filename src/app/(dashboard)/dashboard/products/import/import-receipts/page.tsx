'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/src/app/components/layout/Header';
import Sidebar from '@/src/app/components/layout/Sidebar';
type ImportStatus = 'pending' | 'approved' | 'rejected' | 'imported' | 'returned';

interface ImportRecord {
    id: number;
    code: string;
    supplier: string;
    value: string;
    datetime: string;
    status: ImportStatus;
    type: 'supplier' | 'employee';
}

const mockData: ImportRecord[] = [
    { id: 1, code: 'XXXXXX', supplier: 'Nhà cung cấp A', value: '50.000.000', datetime: '13/11/2022  15:30', status: 'pending', type: 'supplier' },
    { id: 2, code: 'XXXXXX', supplier: 'Nhà cung cấp B', value: '50.000.000', datetime: '13/11/2022  11:09', status: 'imported', type: 'supplier' },
    { id: 3, code: 'XXXXXX', supplier: 'Nhà cung cấp C', value: '50.000.000', datetime: '12/11/2022  14:30', status: 'pending', type: 'supplier' },
    { id: 4, code: 'XXXXXX', supplier: 'Nhà cung cấp A', value: '50.000.000', datetime: '12/11/2022  12:30', status: 'rejected', type: 'supplier' },
    { id: 5, code: 'XXXXXX', supplier: 'Nhà cung cấp D', value: '50.000.000', datetime: '12/11/2022  09:30', status: 'approved', type: 'supplier' },
    { id: 6, code: 'XXXXXX', supplier: 'Nhà cung cấp B', value: '50.000.000', datetime: '11/11/2022  15:30', status: 'approved', type: 'supplier' },
    { id: 7, code: 'XXXXXX', supplier: 'Nhà cung cấp A', value: '50.000.000', datetime: '10/11/2022  16:08', status: 'imported', type: 'supplier' },
    { id: 8, code: 'XXXXXX', supplier: 'Nhà cung cấp E', value: '50.000.000', datetime: '10/11/2022  15:05', status: 'approved', type: 'supplier' },
    { id: 9, code: 'XXXXXX', supplier: 'Nhà cung cấp E', value: '50.000.000', datetime: '10/11/2022  09:55', status: 'rejected', type: 'supplier' },
    { id: 10, code: 'XXXXXX', supplier: 'Nhà cung cấp A', value: '50.000.000', datetime: '10/11/2022  08:30', status: 'imported', type: 'supplier' },
    { id: 11, code: 'XXXXXX', supplier: 'Nhà cung cấp A', value: '50.000.000', datetime: '09/11/2022  17:27', status: 'imported', type: 'supplier' },
    { id: 12, code: 'XXXXXX', supplier: 'Nhà cung cấp C', value: '50.000.000', datetime: '09/11/2022  07:30', status: 'returned', type: 'supplier' },
    { id: 13, code: 'XXXXXX', supplier: 'Nhà cung cấp F', value: '50.000.000', datetime: '08/11/2022  15:30', status: 'imported', type: 'supplier' },
];

const statusConfig = {
    pending: { label: 'Chờ duyệt', color: 'bg-[#fcbd17]' },
    approved: { label: 'Đã duyệt', color: 'bg-[#1ea849]' },
    rejected: { label: 'Từ chối', color: 'bg-[#ee4b3d]' },
    imported: { label: 'Đã nhập', color: 'bg-[#3573eb]' },
    returned: { label: 'Hoàn hàng', color: 'bg-[#b84ebb]' },
};

export default function ImportReceiptsPage() {
    const router = useRouter();
    const [data, setData] = useState<ImportRecord[]>(mockData);
    const [sortField, setSortField] = useState<'value' | 'datetime' | null>(null);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

    const handleSort = (field: 'value' | 'datetime') => {
        const newDirection = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
        setSortField(field);
        setSortDirection(newDirection);

        const sorted = [...data].sort((a, b) => {
            if (field === 'value') {
                const valueA = parseInt(a.value.replace(/\./g, ''));
                const valueB = parseInt(b.value.replace(/\./g, ''));
                return newDirection === 'asc' ? valueA - valueB : valueB - valueA;
            } else {
                const dateA = new Date(a.datetime.split('  ')[0].split('/').reverse().join('-')).getTime();
                const dateB = new Date(b.datetime.split('  ')[0].split('/').reverse().join('-')).getTime();
                return newDirection === 'asc' ? dateA - dateB : dateB - dateA;
            }
        });

        setData(sorted);
    };

    return (
        <div className="min-h-screen">
            <Header />
            <Sidebar />

            <main className="ml-[377px] mt-[113px] p-6 pr-12">
                {/* Filter Section */}
                <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                    <div className="grid grid-cols-5 gap-4 mb-4">
                        {/* Mã phiếu */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Mã phiếu</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Nhập mã phiếu"
                            />
                        </div>

                        {/* Nguồn xuất */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Nguồn xuất</label>
                            <div className="relative">
                                <select className="w-full px-4 py-2 bg-gray-100 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    <option>Tất cả</option>
                                    <option>Nhà cung cấp</option>
                                    <option>Nhân viên</option>
                                </select>
                                <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>

                        {/* Tình trạng */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Tình trạng</label>
                            <div className="relative">
                                <select className="w-full px-4 py-2 bg-gray-100 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    <option>Tất cả</option>
                                    <option>Chờ duyệt</option>
                                    <option>Đã duyệt</option>
                                    <option>Từ chối</option>
                                    <option>Đã nhập</option>
                                    <option>Hoàn hàng</option>
                                </select>
                                <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>

                        {/* Từ ngày */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Từ ngày</label>
                            <div className="relative">
                                <input
                                    type="date"
                                    className="w-full px-4 py-2 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
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
                            onClick={() => router.push('/dashboard/products/import/create-import-receipt')}
                            className="px-6 py-2 bg-[#0046ff] hover:bg-[#0039cc] text-white rounded-lg transition-colors flex items-center gap-2 shadow-lg"
                        >
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M8 3V13M3 8H13" stroke="white" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                            Tạo phiếu nhập kho
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full table-fixed">
                            <colgroup>
                                <col className="w-[80px]" />
                                <col className="w-[150px]" />
                                <col className="w-[200px]" />
                                <col className="w-[140px]" />
                                <col className="w-[200px]" />
                                <col className="w-[150px]" />
                                <col className="w-[120px]" />
                            </colgroup>
                            <thead>
                                <tr className="bg-[#0046ff] text-white h-[48px]">
                                    <th className="px-4 text-center font-bold text-sm">STT</th>
                                    <th className="px-4 text-center font-bold text-sm">Mã phiếu</th>
                                    <th className="px-4 text-center font-bold text-sm">Nguồn xuất</th>
                                    <th className="px-4 text-center font-bold text-sm">
                                        <button
                                            onClick={() => handleSort('value')}
                                            className="flex items-center justify-center gap-2 w-full hover:bg-white/10 py-2 rounded transition-colors"
                                        >
                                            Giá trị
                                            <svg width="16" height="16" viewBox="0 0 16 16" fill="white" className="transition-transform">
                                                <path d="M8 3L11 7H5L8 3Z" opacity={sortField === 'value' && sortDirection === 'asc' ? 1 : 0.4} />
                                                <path d="M8 13L5 9H11L8 13Z" opacity={sortField === 'value' && sortDirection === 'desc' ? 1 : 0.4} />
                                            </svg>
                                        </button>
                                    </th>
                                    <th className="px-4 text-center font-bold text-sm">
                                        <button
                                            onClick={() => handleSort('datetime')}
                                            className="flex items-center justify-center gap-2 w-full hover:bg-white/10 py-2 rounded transition-colors"
                                        >
                                            Thời gian
                                            <svg width="16" height="16" viewBox="0 0 16 16" fill="white" className="transition-transform">
                                                <path d="M8 3L11 7H5L8 3Z" opacity={sortField === 'datetime' && sortDirection === 'asc' ? 1 : 0.4} />
                                                <path d="M8 13L5 9H11L8 13Z" opacity={sortField === 'datetime' && sortDirection === 'desc' ? 1 : 0.4} />
                                            </svg>
                                        </button>
                                    </th>
                                    <th className="px-4 text-center font-bold text-sm">Tình trạng</th>
                                    <th className="px-4 text-center font-bold text-sm">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((record) => (
                                    <tr key={record.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors h-[48px]">
                                        <td className="px-4 text-center text-sm">{record.id}</td>
                                        <td className="px-4 text-center text-sm">{record.code}</td>
                                        <td className="px-4 text-center text-sm">{record.supplier}</td>
                                        <td className="px-4 text-center text-sm">{record.value}</td>
                                        <td className="px-4 text-center text-sm whitespace-nowrap">{record.datetime}</td>
                                        <td className="px-4 text-center">
                                            <span className={`inline-block px-4 py-1 rounded-md text-sm font-medium text-black ${statusConfig[record.status].color}`}>
                                                {statusConfig[record.status].label}
                                            </span>
                                        </td>
                                        <td className="px-4">
                                            <div className="flex items-center justify-center gap-3">
                                                <button
                                                    onClick={() => router.push(`/dashboard/products/import/view-import-receipt/${record.id}`)}
                                                    className="hover:scale-110 transition-transform"
                                                    title="Xem chi tiết"
                                                >
                                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                        <path d="M12 5C7 5 2.73 8.11 1 12.5C2.73 16.89 7 20 12 20C17 20 21.27 16.89 23 12.5C21.27 8.11 17 5 12 5Z" stroke="#0046ff" strokeWidth="2" />
                                                        <circle cx="12" cy="12.5" r="3" stroke="#0046ff" strokeWidth="2" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => router.push(`/dashboard/products/import/edit-import-receipt/${record.id}`)}
                                                    className="hover:scale-110 transition-transform"
                                                    title="Chỉnh sửa"
                                                >
                                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                        <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="#0046ff" strokeWidth="2" strokeLinecap="round" />
                                                        <path d="M18.5 2.5C18.8978 2.10217 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10217 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10217 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="#0046ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
