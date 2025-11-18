'use client';

import Header from '@/src/app/components/layout/Header';
import Sidebar from '@/src/app/components/layout/Sidebar';
import { useRouter } from 'next/navigation';

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

const products: ProductItem[] = [
    { id: 1, name: 'ĐT Samsung Galaxy Z', code: 'XXXXX', unit: 'Cái', price: '30.000.000', quantity: '10', discount: '5%', total: '285.000.000' },
    { id: 2, name: 'ĐT Xiaomi Redmi 10', code: 'XXXXX', unit: 'Cái', price: '3.998.000', quantity: '10', discount: '', total: '39.980.000' },
    { id: 3, name: 'ĐT Iphone 13 Promax', code: 'XXXXX', unit: 'Cái', price: '40.000.000', quantity: '5', discount: '5%', total: '78.154.168' },
    { id: 4, name: 'Tai nghe Xiaomi', code: 'XXXXX', unit: 'Cái', price: '20.000.000', quantity: '4', discount: '5%', total: '800.000' },
    { id: 5, name: 'Tai nghe Oppo Renco', code: 'XXXXX', unit: 'Cái', price: '790.000', quantity: '55', discount: '', total: '20.000.000' },
];

export default function ViewInternalExportReceipt() {
    const router = useRouter();

    const calculateTotal = () => {
        return products.reduce((sum, item) => {
            const total = item.total ? parseInt(item.total.replace(/\./g, '')) : 0;
            return sum + total;
        }, 0).toLocaleString('vi-VN');
    };

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
                                            Đại lý A
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <label className="w-28 text-sm">Mã nguồn</label>
                                        <div className="flex-1 px-3 py-1.5 border border-black bg-white text-sm text-right">
                                            DLA_9843
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <label className="w-28 text-sm">Số điện thoại</label>
                                        <div className="flex-1 px-3 py-1.5 border border-black bg-white text-sm text-right">
                                            0985424661
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <label className="w-28 text-sm pt-2">Địa chỉ</label>
                                        <div className="flex-1 px-3 py-2 border border-black bg-white text-sm text-right h-14">
                                            446 Minh Khai, p. Vĩnh Tuy, q2, HCM.
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <label className="w-28 text-sm">Mã phiếu</label>
                                        <div className="flex-1 px-3 py-1.5 border border-black bg-gray-200 text-sm text-right">
                                            PXK_NB_001
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
                                            Xuất hàng cho đại lý
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
                                        <th className="px-2 text-center font-bold text-sm w-24">Chiết khấu</th>
                                        <th className="px-2 text-center font-bold text-sm w-32">Thành tiền</th>
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
                                            <td className="px-2 text-center text-sm border-r border-gray-400">{product.quantity}</td>
                                            <td className="px-2 text-right text-sm border-r border-gray-400">{product.discount}</td>
                                            <td className="px-2 text-right text-sm font-medium border-r border-gray-400">{product.total}</td>
                                        </tr>
                                    ))}
                                    <tr className="border border-gray-400 h-12 bg-white">
                                        <td colSpan={7} className="px-2 text-center font-bold text-sm border-r border-gray-400">Tổng</td>
                                        <td className="px-2 text-right font-bold text-sm border-r border-gray-400">{calculateTotal()}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* Hợp đồng */}
                        <div className="border border-black bg-gray-100 p-6">
                            <div className="flex items-center gap-4 mb-4">
                                <svg width="25" height="25" viewBox="0 0 25 25" fill="none">
                                    <path d="M7 3H17C18.1046 3 19 3.89543 19 5V21L12 17L5 21V5C5 3.89543 5.89543 3 7 3Z" stroke="#000" strokeWidth="2" />
                                </svg>
                                <h3 className="text-sm font-bold">Hợp đồng</h3>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-[183px] h-[236px] bg-gray-300 rounded flex items-center justify-center">
                                    <span className="text-gray-600">Hình ảnh 1</span>
                                </div>
                                <div className="w-[183px] h-[236px] bg-gray-300 rounded flex items-center justify-center">
                                    <span className="text-gray-600">Hình ảnh 2</span>
                                </div>
                            </div>
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
                            <div className="px-3 py-1.5 bg-gray-200 border border-gray-400 text-sm text-right">13/11/2022  15:20</div>
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

                        {/* Đã xuất bởi */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm">Đã xuất bởi</span>
                                <div className="px-2 py-1.5 bg-[#888888] rounded-lg shadow text-sm text-white">Đã xuất</div>
                            </div>
                            <div className="px-3 py-2 bg-white border border-gray-400 h-8"></div>
                            <div className="px-3 py-1.5 bg-white border border-gray-400 h-7"></div>
                        </div>

                        {/* Hoàn hàng bởi */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm">Hoàn hàng bởi</span>
                                <div className="flex items-center gap-2 px-2 py-1.5 bg-[#888888] rounded-lg shadow text-sm text-white">
                                    <span>Hoàn hàng</span>
                                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                        <path d="M4 9H14M4 9L8 5M4 9L8 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
