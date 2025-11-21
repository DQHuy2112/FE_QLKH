/* eslint-disable @next/next/no-img-element */
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import { getProducts } from '@/services/product.service';
import { getSuppliers, type Supplier } from '@/services/supplier.service';
import { SUPPLIER_TYPES, SUPPLIER_TYPE_LABELS, type SupplierType } from '@/types/supplier';
import type { Product } from '@/types/product';

interface ProductItem {
    id: number;
    productId: number;
    name: string;
    code: string;
    unit: string;
    price: string;
    quantity: string;
    total: string;
}

const formatCurrency = (value: number) => value.toLocaleString('vi-VN', { maximumFractionDigits: 0 });
const parseNumber = (value: string): number => {
    const cleaned = value.replace(/[^\d]/g, '');
    return cleaned ? Number(cleaned) : 0;
};

export default function EditImportOrder() {
    const router = useRouter();
    const params = useParams();
    const id = params.id;

    const [supplierType, setSupplierType] = useState<SupplierType | ''>('');
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [sourceId, setSourceId] = useState<number | ''>(1);
    const [sourceCode, setSourceCode] = useState('');
    const [sourcePhone, setSourcePhone] = useState('');
    const [sourceAddress, setSourceAddress] = useState('');
    const [note, setNote] = useState('');
    const [orderCode, setOrderCode] = useState('');
    const [products, setProducts] = useState<ProductItem[]>([]);
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const [showProductModal, setShowProductModal] = useState(false);
    const [productList, setProductList] = useState<Product[]>([]);
    const [loadingProducts, setLoadingProducts] = useState(false);
    const [loadingSuppliers, setLoadingSuppliers] = useState(false);

    useEffect(() => {
        loadOrderData();
    }, [id]);

    useEffect(() => {
        loadSuppliers();
    }, [supplierType]);

    const loadSuppliers = async () => {
        if (!supplierType) {
            setSuppliers([]);
            return;
        }

        try {
            setLoadingSuppliers(true);
            const result = await getSuppliers(supplierType);
            setSuppliers(result);
        } catch (error) {
            console.error('Lỗi khi tải danh sách nhà cung cấp:', error);
        } finally {
            setLoadingSuppliers(false);
        }
    };

    const loadOrderData = async () => {
        try {
            setLoading(true);
            const { getImportOrderById } = await import('@/services/inventory.service');
            const { getProduct } = await import('@/services/product.service');

            const order = await getImportOrderById(Number(id));

            // Set basic info
            setOrderCode(order.code);
            setSourceId(order.supplierId || '');
            setNote(order.note || '');

            // Fetch supplier info if needed
            if (order.supplierId && !order.supplierName) {
                const allSuppliers = await getSuppliers();
                const supplier = allSuppliers.find(s => s.id === order.supplierId);
                if (supplier) {
                    setSupplierType(supplier.type as SupplierType || '');
                    setSourceCode(supplier.code || '');
                    setSourcePhone(supplier.phone || '');
                    setSourceAddress(supplier.address || '');
                }
            } else {
                setSourceCode(order.supplierCode || '');
                setSourcePhone(order.supplierPhone || '');
                setSourceAddress(order.supplierAddress || '');
            }

            // Map products
            if (order.items && order.items.length > 0) {
                const mappedProducts: ProductItem[] = await Promise.all(
                    order.items.map(async (item, idx) => {
                        let productName = item.productName || '';
                        let productCode = item.productCode || '';

                        // Fetch product info if missing
                        if (!productName && item.productId) {
                            try {
                                const product = await getProduct(item.productId);
                                productName = product.name;
                                productCode = product.code;
                            } catch (err) {
                                console.error('Failed to fetch product:', err);
                                productName = `Sản phẩm #${item.productId}`;
                            }
                        }

                        return {
                            id: Date.now() + idx,
                            productId: item.productId,
                            name: productName,
                            code: productCode,
                            unit: item.unitName || item.unit || 'Cái',
                            price: formatCurrency(item.unitPrice),
                            quantity: String(item.quantity),
                            total: formatCurrency(item.unitPrice * item.quantity),
                        };
                    })
                );
                setProducts(mappedProducts);
            }
        } catch (error) {
            console.error('Lỗi khi tải dữ liệu lệnh nhập:', error);
            alert('Không thể tải dữ liệu lệnh nhập');
        } finally {
            setLoading(false);
        }
    };

    const handleSupplierChange = (supplierId: string) => {
        const id = supplierId ? Number(supplierId) : '';
        setSourceId(id);

        if (id) {
            const supplier = suppliers.find(s => s.id === id);
            if (supplier) {
                setSourceCode(supplier.code || '');
                setSourcePhone(supplier.phone || '');
                setSourceAddress(supplier.address || '');
            }
        } else {
            setSourceCode('');
            setSourcePhone('');
            setSourceAddress('');
        }
    };

    const recalcRowTotal = (item: ProductItem): ProductItem => {
        const price = parseNumber(item.price);
        const qty = parseNumber(item.quantity);
        const total = price * qty;
        return { ...item, total: total > 0 ? formatCurrency(total) : '' };
    };

    const handleChangeProductField = (
        id: number,
        field: keyof ProductItem,
        value: string
    ) => {
        setProducts((prev) =>
            prev.map((item) => {
                if (item.id !== id) return item;
                const updated = { ...item, [field]: value };
                return recalcRowTotal(updated);
            })
        );
    };

    const deleteProduct = (id: number) => {
        setProducts(products.filter((p) => p.id !== id));
    };

    const calculateTotal = () => {
        return products.reduce((sum, item) => {
            const total = item.total ? parseNumber(item.total) : 0;
            return sum + total;
        }, 0);
    };

    const handleOpenProductModal = async () => {
        try {
            setLoadingProducts(true);
            const list = await getProducts();
            setProductList(list);
            setShowProductModal(true);
        } catch (error) {
            console.error('Lỗi khi tải danh sách sản phẩm:', error);
            alert('Không thể tải danh sách sản phẩm');
        } finally {
            setLoadingProducts(false);
        }
    };

    const handleAddProducts = () => {
        const selectedProducts = productList.filter((p) =>
            (document.getElementById(`product-${p.id}`) as HTMLInputElement)?.checked
        );

        const newItems: ProductItem[] = selectedProducts.map((p, idx) => ({
            id: Date.now() + idx,
            productId: p.id,
            name: p.name,
            code: p.code || '',
            unit: 'Cái',
            price: formatCurrency(p.unitPrice ?? 0),
            quantity: '',
            total: '',
        }));

        setProducts([...products, ...newItems]);
        setShowProductModal(false);
    };

    const handleSave = async () => {
        if (!sourceId) {
            alert('Vui lòng chọn nguồn xuất');
            return;
        }

        if (products.length === 0) {
            alert('Vui lòng thêm ít nhất một sản phẩm');
            return;
        }

        try {
            setSaving(true);
            const { updateImportOrder } = await import('@/services/inventory.service');
            const payload = {
                storeId: 1, // TODO: Get from user context
                supplierId: Number(sourceId),
                note: note || undefined,
                items: products.map((p) => ({
                    productId: p.productId,
                    quantity: parseNumber(p.quantity),
                    unitPrice: parseNumber(p.price),
                })),
            };

            await updateImportOrder(Number(id), payload);
            alert('Cập nhật lệnh nhập kho thành công!');
            router.push(`/orders/import/view-import-order/${id}`);
        } catch (error) {
            console.error('Lỗi khi cập nhật lệnh nhập:', error);
            alert(error instanceof Error ? error.message : 'Không thể cập nhật lệnh nhập');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="min-h-screen">
            <Header />
            <Sidebar />

            <main className="ml-[377px] mt-[113px] p-6 pr-12">
                <div className="mb-4">
                    <p className="text-base font-bold text-gray-800">
                        Lệnh nhập kho &gt; Chỉnh sửa lệnh nhập
                    </p>
                </div>

                {loading ? (
                    <div className="bg-white rounded-lg shadow-2xl p-8">
                        <div className="text-center py-12 text-gray-500">
                            Đang tải dữ liệu...
                        </div>
                    </div>
                ) : (
                    <div>

                        <div className="flex gap-4 mb-6">
                            <button
                                onClick={handleOpenProductModal}
                                disabled={loadingProducts}
                                className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg font-bold text-sm shadow-lg transition-all"
                            >
                                + Thêm hàng<br />từ hệ thống
                            </button>
                        </div>

                        <div className="bg-white rounded-lg shadow-2xl p-8">
                            <h2 className="text-xl font-bold text-center mb-6">LỆNH NHẬP KHO</h2>

                            {/* Thông tin chung */}
                            <div className="border-4 border-blue-600 bg-gray-100 p-6 mb-6 rounded">
                                <h3 className="text-base font-bold mb-4">Thông tin chung</h3>

                                <div className="grid grid-cols-2 gap-x-12 gap-y-4">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <label className="w-28 text-sm">Mã lệnh</label>
                                            <div className="flex-1 px-3 py-1.5 border border-gray-400 rounded bg-gray-200">
                                                {orderCode || `LNK_${id}`}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <label className="w-28 text-sm">Loại nguồn</label>
                                            <div className="flex-1 relative">
                                                <select
                                                    value={supplierType}
                                                    onChange={(e) => {
                                                        setSupplierType(e.target.value as SupplierType | '');
                                                        setSourceId('');
                                                        setSourceCode('');
                                                        setSourcePhone('');
                                                        setSourceAddress('');
                                                    }}
                                                    className="w-full px-3 py-1.5 border border-blue-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                                                >
                                                    <option value="">Chọn loại nguồn</option>
                                                    {Object.entries(SUPPLIER_TYPE_LABELS).map(([key, label]) => (
                                                        <option key={key} value={key}>
                                                            {label}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <label className="w-28 text-sm">Nguồn xuất</label>
                                            <div className="flex-1 relative">
                                                <select
                                                    value={sourceId}
                                                    onChange={(e) => handleSupplierChange(e.target.value)}
                                                    disabled={!supplierType || loadingSuppliers}
                                                    className="w-full px-3 py-1.5 border border-blue-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white disabled:opacity-50"
                                                >
                                                    <option value="">
                                                        {!supplierType ? 'Chọn loại nguồn trước' : 'Chọn nguồn xuất'}
                                                    </option>
                                                    {suppliers.map((supplier) => (
                                                        <option key={supplier.id} value={supplier.id}>
                                                            {supplier.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <label className="w-28 text-sm">Mã nguồn</label>
                                            <input
                                                type="text"
                                                value={sourceCode}
                                                readOnly
                                                className="flex-1 px-3 py-1.5 border border-gray-400 rounded bg-gray-100 text-sm"
                                            />
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <label className="w-28 text-sm">Số điện thoại</label>
                                            <input
                                                type="text"
                                                value={sourcePhone}
                                                readOnly
                                                className="flex-1 px-3 py-1.5 border border-gray-400 rounded bg-gray-100 text-sm"
                                            />
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <label className="w-28 text-sm pt-2">Địa chỉ</label>
                                            <textarea
                                                value={sourceAddress}
                                                readOnly
                                                className="flex-1 px-3 py-2 border border-gray-400 rounded bg-gray-100 text-sm h-14 resize-none"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-start gap-3">
                                            <label className="w-28 text-sm pt-2">Ghi chú</label>
                                            <textarea
                                                value={note}
                                                onChange={(e) => setNote(e.target.value)}
                                                className="flex-1 px-3 py-2 border border-blue-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 h-14 resize-none"
                                            />
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
                                            <th className="px-2 text-center font-bold text-sm w-28">Thành tiền</th>
                                            <th className="px-2 text-center font-bold text-sm w-16">Xóa</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {products.map((product, index) => (
                                            <tr key={product.id} className="border border-gray-400 h-12 hover:bg-gray-50">
                                                <td className="px-2 text-center text-sm border-r border-gray-400">{index + 1}</td>
                                                <td className="px-2 text-right text-sm border-r border-gray-400">{product.name}</td>
                                                <td className="px-2 text-center text-sm border-r border-gray-400">{product.code}</td>
                                                <td className="px-2 text-center text-sm border-r border-gray-400">{product.unit}</td>
                                                <td className="px-2 border-r border-gray-400">
                                                    <input
                                                        type="text"
                                                        value={product.price}
                                                        onChange={(e) => handleChangeProductField(product.id, 'price', e.target.value)}
                                                        className="w-full text-right px-2 py-1 border-0 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                    />
                                                </td>
                                                <td className="px-2 border-r border-gray-400">
                                                    <input
                                                        type="text"
                                                        value={product.quantity}
                                                        onChange={(e) => handleChangeProductField(product.id, 'quantity', e.target.value)}
                                                        className="w-full text-center px-2 py-1 border-0 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                    />
                                                </td>
                                                <td className="px-2 text-right text-sm font-medium border-r border-gray-400">{product.total}</td>
                                                <td className="px-2 text-center border-r border-gray-400">
                                                    <button onClick={() => deleteProduct(product.id)} className="hover:scale-110 transition-transform">
                                                        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                                                            <path d="M3 6H19M8 6V4C8 3.44772 8.44772 3 9 3H13C13.5523 3 14 3.44772 14 4V6M17 6V18C17 18.5523 16.5523 19 16 19H6C5.44772 19 5 18.5523 5 18V6H17Z" stroke="#f90606" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        <tr className="border border-gray-400 h-12 bg-white">
                                            <td colSpan={6} className="px-2 text-center font-bold text-sm border-r border-gray-400">Tổng</td>
                                            <td className="px-2 text-right font-bold text-sm border-r border-gray-400">{formatCurrency(calculateTotal())}</td>
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
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-sm shadow-lg transition-colors disabled:opacity-50"
                                >
                                    {saving ? 'Đang lưu...' : 'Lưu'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* Product Selection Modal */}
            {showProductModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg w-[900px] max-h-[80vh] flex flex-col shadow-2xl">
                        <div className="px-6 py-4 border-b flex items-center justify-between">
                            <h3 className="text-lg font-bold">Chọn hàng hóa</h3>
                            <button
                                onClick={() => setShowProductModal(false)}
                                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                            >
                                ×
                            </button>
                        </div>

                        <div className="flex-1 overflow-auto">
                            {loadingProducts ? (
                                <div className="flex items-center justify-center py-12">
                                    <div className="text-gray-500">Đang tải...</div>
                                </div>
                            ) : (
                                <table className="w-full">
                                    <thead className="bg-gray-100 sticky top-0">
                                        <tr>
                                            <th className="px-4 py-3 text-left w-12">
                                                <input type="checkbox" className="w-4 h-4" />
                                            </th>
                                            <th className="px-4 py-3 text-left">Mã hàng</th>
                                            <th className="px-4 py-3 text-left">Tên hàng hóa</th>
                                            <th className="px-4 py-3 text-right">Tồn kho</th>
                                            <th className="px-4 py-3 text-right">Đơn giá</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {productList.map((p) => {
                                            const alreadyAdded = products.some(prod => prod.productId === p.id);
                                            const disabled = alreadyAdded;

                                            return (
                                                <tr
                                                    key={p.id}
                                                    className={`border-t cursor-pointer ${disabled
                                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                        : 'hover:bg-gray-50'
                                                        }`}
                                                    onClick={() => {
                                                        if (!disabled) {
                                                            const checkbox = document.getElementById(`product-${p.id}`) as HTMLInputElement;
                                                            if (checkbox) checkbox.checked = !checkbox.checked;
                                                        }
                                                    }}
                                                >
                                                    <td className="px-4 py-2">
                                                        <input
                                                            type="checkbox"
                                                            id={`product-${p.id}`}
                                                            disabled={disabled}
                                                            className="w-4 h-4"
                                                            onClick={(e) => e.stopPropagation()}
                                                        />
                                                    </td>
                                                    <td className="px-4 py-2">{p.code}</td>
                                                    <td className="px-4 py-2">
                                                        {p.name}
                                                        {disabled && (
                                                            <span className="ml-2 text-xs text-gray-500">
                                                                (Đã có trong phiếu)
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-2 text-right">{p.quantity ?? 0}</td>
                                                    <td className="px-4 py-2 text-right">{formatCurrency(p.unitPrice ?? 0)}</td>
                                                </tr>
                                            );
                                        })}
                                        {productList.length === 0 && (
                                            <tr>
                                                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                                                    Không có hàng hóa nào
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            )}
                        </div>

                        <div className="px-6 py-4 border-t bg-gray-50 flex items-center justify-between">
                            <span className="text-sm">
                                Đã chọn: <span className="font-semibold">
                                    {productList.filter(p => (document.getElementById(`product-${p.id}`) as HTMLInputElement)?.checked).length} sản phẩm
                                </span>
                            </span>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowProductModal(false)}
                                    className="px-4 py-2 rounded border border-gray-300 text-sm hover:bg-gray-100"
                                >
                                    Đóng
                                </button>
                                <button
                                    onClick={handleAddProducts}
                                    disabled={loadingProducts}
                                    className="px-4 py-2 rounded bg-sky-600 text-white text-sm font-medium hover:bg-sky-700 disabled:opacity-60"
                                >
                                    Thêm hàng đã chọn
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
