'use client';

import { useState } from 'react';
import type { ImportLot } from '@/services/inventory.service';

interface ImportLotSelectModalProps {
    productName: string;
    productCode: string;
    lots: ImportLot[];
    onClose: () => void;
    onSelect: (lot: ImportLot) => void;
}

export default function ImportLotSelectModal({
    productName,
    productCode,
    lots,
    onClose,
    onSelect,
}: ImportLotSelectModalProps) {
    const [selectedId, setSelectedId] = useState<number | null>(null);

    const handleConfirm = () => {
        if (selectedId == null) {
            onClose();
            return;
        }
        const chosen = lots.find((l) => l.id === selectedId);
        if (chosen) {
            onSelect(chosen);
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40">
            <div className="w-[900px] max-h-[80vh] bg-white rounded-xl shadow-xl flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b">
                    <div>
                        <h2 className="text-lg font-semibold">Chọn lô nhập</h2>
                        <p className="text-sm text-gray-600 mt-1">
                            Sản phẩm:{' '}
                            <span className="font-medium">
                                {productName} ({productCode})
                            </span>
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-black text-xl"
                    >
                        ✕
                    </button>
                </div>

                {/* Table */}
                <div className="flex-1 overflow-auto">
                    <table className="w-full text-sm">
                        <thead className="sticky top-0 bg-gray-100 z-10">
                            <tr>
                                <th className="px-3 py-2 text-left w-14">Chọn</th>
                                <th className="px-3 py-2 text-left">Mã phiếu nhập</th>
                                <th className="px-3 py-2 text-left">Ngày nhập</th>
                                <th className="px-3 py-2 text-right">SL nhập</th>
                                <th className="px-3 py-2 text-right">SL còn</th>
                                <th className="px-3 py-2 text-right">Đơn giá</th>
                            </tr>
                        </thead>
                        <tbody>
                            {lots.map((lot) => (
                                <tr
                                    key={lot.id}
                                    className="border-t hover:bg-gray-50 cursor-pointer"
                                    onClick={() => setSelectedId(lot.id)}
                                >
                                    <td className="px-3 py-2">
                                        <input
                                            type="radio"
                                            checked={selectedId === lot.id}
                                            onChange={() => setSelectedId(lot.id)}
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    </td>
                                    <td className="px-3 py-2">{lot.importCode}</td>
                                    <td className="px-3 py-2">
                                        {new Date(lot.importsDate).toLocaleDateString('vi-VN')}
                                    </td>
                                    <td className="px-3 py-2 text-right">
                                        {lot.quantity.toLocaleString('vi-VN')}
                                    </td>
                                    <td className="px-3 py-2 text-right font-medium">
                                        {lot.remainingQuantity.toLocaleString('vi-VN')}
                                    </td>
                                    <td className="px-3 py-2 text-right">
                                        {lot.unitPrice.toLocaleString('vi-VN')}
                                    </td>
                                </tr>
                            ))}

                            {lots.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="px-3 py-4 text-center text-gray-500"
                                    >
                                        Không có lô nhập nào còn tồn cho sản phẩm này.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between px-6 py-4 border-t bg-gray-50 text-sm">
                    <span>
                        Đã chọn:{' '}
                        <span className="font-semibold">
                            {selectedId ? '1 lô nhập' : 'Chưa chọn'}
                        </span>
                    </span>
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
                        >
                            Đóng
                        </button>
                        <button
                            onClick={handleConfirm}
                            className="px-4 py-2 rounded bg-sky-600 text-white font-medium hover:bg-sky-700 disabled:opacity-60"
                            disabled={selectedId == null}
                        >
                            Xác nhận
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
