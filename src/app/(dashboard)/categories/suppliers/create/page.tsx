'use client';

import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';

export default function ThemMoiNguon() {
    const router = useRouter();

    return (
        <div className="min-h-screen">
            <Header />
            <Sidebar />

            <main className="ml-[377px] mt-[113px] p-6 pr-12">
                {/* Breadcrumb */}
                <div className="mb-4">
                    <p className="text-base font-bold text-gray-800">
                        Danh mục &gt; Nguồn hàng xuất/nhập &gt; Thêm mới nguồn
                    </p>
                </div>

                {/* Main Form */}
                <div className="bg-white rounded-lg shadow-2xl p-8">
                    <h2 className="text-xl font-bold text-center mb-6">THÊM MỚI NGUỒN HÀNG</h2>

                    {/* Form Fields */}
                    <div className="max-w-4xl mx-auto space-y-6">
                        {/* Loại nguồn */}
                        <div className="grid grid-cols-3 gap-4 items-center">
                            <label className="text-sm font-medium text-gray-700">Loại nguồn <span className="text-red-500">*</span></label>
                            <div className="col-span-2 relative">
                                <select className="w-full px-4 py-2 border border-blue-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white">
                                    <option value="">Chọn loại nguồn</option>
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

                        {/* Tên nguồn */}
                        <div className="grid grid-cols-3 gap-4 items-center">
                            <label className="text-sm font-medium text-gray-700">Tên nguồn <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                className="col-span-2 px-4 py-2 border border-blue-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Nhập tên nguồn"
                            />
                        </div>

                        {/* Mã nguồn */}
                        <div className="grid grid-cols-3 gap-4 items-center">
                            <label className="text-sm font-medium text-gray-700">Mã nguồn <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                className="col-span-2 px-4 py-2 border border-blue-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Nhập mã nguồn"
                            />
                        </div>

                        {/* Số điện thoại */}
                        <div className="grid grid-cols-3 gap-4 items-center">
                            <label className="text-sm font-medium text-gray-700">Số điện thoại <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                className="col-span-2 px-4 py-2 border border-blue-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Nhập số điện thoại"
                            />
                        </div>

                        {/* Email */}
                        <div className="grid grid-cols-3 gap-4 items-center">
                            <label className="text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                className="col-span-2 px-4 py-2 border border-blue-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Nhập email"
                            />
                        </div>

                        {/* Địa chỉ */}
                        <div className="grid grid-cols-3 gap-4 items-start">
                            <label className="text-sm font-medium text-gray-700 pt-2">Địa chỉ <span className="text-red-500">*</span></label>
                            <textarea
                                className="col-span-2 px-4 py-2 border border-blue-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none"
                                placeholder="Nhập địa chỉ"
                            ></textarea>
                        </div>

                        {/* Mã số thuế */}
                        <div className="grid grid-cols-3 gap-4 items-center">
                            <label className="text-sm font-medium text-gray-700">Mã số thuế</label>
                            <input
                                type="text"
                                className="col-span-2 px-4 py-2 border border-blue-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Nhập mã số thuế"
                            />
                        </div>

                        {/* Người đại diện */}
                        <div className="grid grid-cols-3 gap-4 items-center">
                            <label className="text-sm font-medium text-gray-700">Người đại diện</label>
                            <input
                                type="text"
                                className="col-span-2 px-4 py-2 border border-blue-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Nhập tên người đại diện"
                            />
                        </div>

                        {/* Chức vụ */}
                        <div className="grid grid-cols-3 gap-4 items-center">
                            <label className="text-sm font-medium text-gray-700">Chức vụ</label>
                            <input
                                type="text"
                                className="col-span-2 px-4 py-2 border border-blue-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Nhập chức vụ"
                            />
                        </div>

                        {/* Ghi chú */}
                        <div className="grid grid-cols-3 gap-4 items-start">
                            <label className="text-sm font-medium text-gray-700 pt-2">Ghi chú</label>
                            <textarea
                                className="col-span-2 px-4 py-2 border border-blue-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none"
                                placeholder="Nhập ghi chú"
                            ></textarea>
                        </div>

                        {/* Trạng thái */}
                        <div className="grid grid-cols-3 gap-4 items-center">
                            <label className="text-sm font-medium text-gray-700">Trạng thái</label>
                            <div className="col-span-2 flex items-center gap-6">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="status"
                                        value="active"
                                        defaultChecked
                                        className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="text-sm">Hoạt động</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="status"
                                        value="inactive"
                                        className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="text-sm">Ngừng hoạt động</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-center gap-6 mt-8">
                        <button
                            onClick={() => router.back()}
                            className="px-12 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-sm shadow-lg transition-colors"
                        >
                            Hủy
                        </button>
                        <button className="px-12 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-sm shadow-lg transition-colors">
                            Lưu
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}
