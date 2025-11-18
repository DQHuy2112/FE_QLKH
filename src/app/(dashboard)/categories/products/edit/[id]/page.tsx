'use client';

import { useRouter } from 'next/navigation';
import Header from '@/src/app/components/layout/Header';
import Sidebar from '@/src/app/components/layout/Sidebar';

export default function ChinhSuaHangHoa() {
    const router = useRouter();

    return (
        <div className="min-h-screen">
            <Header />
            <Sidebar />

            <main className="ml-[377px] mt-[113px] p-6 pr-12">
                {/* Breadcrumb */}
                <div className="mb-4">
                    <p className="text-base font-bold text-gray-800">
                        Danh mục &gt; Danh mục hàng hóa &gt; Chỉnh sửa hàng hóa
                    </p>
                </div>

                {/* Main Form */}
                <div className="bg-white rounded-lg shadow-2xl p-8">
                    <h2 className="text-xl font-bold text-center mb-6">CHỈNH SỬA HÀNG HÓA</h2>

                    {/* Form Fields */}
                    <div className="max-w-4xl mx-auto space-y-6">
                        {/* Mã hàng hóa */}
                        <div className="grid grid-cols-3 gap-4 items-center">
                            <label className="text-sm font-medium text-gray-700">Mã hàng hóa <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                defaultValue="XXXXX"
                                className="col-span-2 px-4 py-2 border border-blue-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Nhập mã hàng hóa"
                            />
                        </div>

                        {/* Tên hàng hóa */}
                        <div className="grid grid-cols-3 gap-4 items-center">
                            <label className="text-sm font-medium text-gray-700">Tên hàng hóa <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                defaultValue="ĐT Samsung Galaxy"
                                className="col-span-2 px-4 py-2 border border-blue-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Nhập tên hàng hóa"
                            />
                        </div>

                        {/* Nhóm hàng */}
                        <div className="grid grid-cols-3 gap-4 items-center">
                            <label className="text-sm font-medium text-gray-700">Nhóm hàng <span className="text-red-500">*</span></label>
                            <div className="col-span-2 relative">
                                <select defaultValue="Điện thoại" className="w-full px-4 py-2 border border-blue-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white">
                                    <option value="">Chọn nhóm hàng</option>
                                    <option>Điện thoại</option>
                                    <option>Tai nghe</option>
                                    <option>Cáp sạc - Củ sạc</option>
                                    <option>Phụ kiện</option>
                                </select>
                                <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>

                        {/* Đơn vị tính */}
                        <div className="grid grid-cols-3 gap-4 items-center">
                            <label className="text-sm font-medium text-gray-700">Đơn vị tính <span className="text-red-500">*</span></label>
                            <div className="col-span-2 relative">
                                <select defaultValue="Cái" className="w-full px-4 py-2 border border-blue-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white">
                                    <option value="">Chọn đơn vị tính</option>
                                    <option>Cái</option>
                                    <option>Chiếc</option>
                                    <option>Bộ</option>
                                    <option>Hộp</option>
                                    <option>Thùng</option>
                                </select>
                                <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>

                        {/* Đơn giá */}
                        <div className="grid grid-cols-3 gap-4 items-center">
                            <label className="text-sm font-medium text-gray-700">Đơn giá <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                defaultValue="30.000.000"
                                className="col-span-2 px-4 py-2 border border-blue-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Nhập đơn giá"
                            />
                        </div>

                        {/* Giá nhập */}
                        <div className="grid grid-cols-3 gap-4 items-center">
                            <label className="text-sm font-medium text-gray-700">Giá nhập</label>
                            <input
                                type="text"
                                defaultValue="28.000.000"
                                className="col-span-2 px-4 py-2 border border-blue-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Nhập giá nhập"
                            />
                        </div>

                        {/* Giá bán */}
                        <div className="grid grid-cols-3 gap-4 items-center">
                            <label className="text-sm font-medium text-gray-700">Giá bán</label>
                            <input
                                type="text"
                                defaultValue="32.000.000"
                                className="col-span-2 px-4 py-2 border border-blue-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Nhập giá bán"
                            />
                        </div>

                        {/* Tồn kho tối thiểu */}
                        <div className="grid grid-cols-3 gap-4 items-center">
                            <label className="text-sm font-medium text-gray-700">Tồn kho tối thiểu</label>
                            <input
                                type="number"
                                defaultValue="10"
                                className="col-span-2 px-4 py-2 border border-blue-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Nhập số lượng tồn kho tối thiểu"
                            />
                        </div>

                        {/* Tồn kho tối đa */}
                        <div className="grid grid-cols-3 gap-4 items-center">
                            <label className="text-sm font-medium text-gray-700">Tồn kho tối đa</label>
                            <input
                                type="number"
                                defaultValue="1000"
                                className="col-span-2 px-4 py-2 border border-blue-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Nhập số lượng tồn kho tối đa"
                            />
                        </div>

                        {/* Mô tả */}
                        <div className="grid grid-cols-3 gap-4 items-start">
                            <label className="text-sm font-medium text-gray-700 pt-2">Mô tả</label>
                            <textarea
                                defaultValue="Điện thoại Samsung Galaxy cao cấp"
                                className="col-span-2 px-4 py-2 border border-blue-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none"
                                placeholder="Nhập mô tả sản phẩm"
                            ></textarea>
                        </div>

                        {/* Hình ảnh */}
                        <div className="grid grid-cols-3 gap-4 items-center">
                            <label className="text-sm font-medium text-gray-700">Hình ảnh</label>
                            <div className="col-span-2">
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="w-full px-4 py-2 border border-blue-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
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
                                    <span className="text-sm">Đang kinh doanh</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="status"
                                        value="inactive"
                                        className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="text-sm">Ngừng kinh doanh</span>
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
