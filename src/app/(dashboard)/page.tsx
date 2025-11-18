'use client';

import { useEffect, useState } from 'react';
import { getOrders } from '@/services/order.service';
import type { Order } from '@/types/order';

export default function DashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await getOrders();
        setOrders(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message || 'Lỗi tải đơn hàng');
        } else {
          setError('Lỗi tải đơn hàng');
        }
      }
    })();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Danh sách đơn hàng</h1>
      {error && <p className="text-red-600 text-sm mb-2">{error}</p>}

      <table className="w-full text-sm border">
        <thead className="bg-slate-100">
          <tr>
            <th className="border px-2 py-1 text-left">ID</th>
            {/* thêm các cột khác */}
          </tr>
        </thead>
        <tbody>
          {orders.map(o => (
            <tr key={o.id}>
              <td className="border px-2 py-1">{o.id}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
