// src/services/order.service.ts
import { apiFetch } from '@/lib/api-client';
import type { Order } from '@/types/order';

export async function getOrders(): Promise<Order[]> {
  return apiFetch<Order[]>('/api/orders');
}
