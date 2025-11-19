// src/services/product.service.ts
import { apiFetch } from '@/lib/api-client';
import type { Product, ProductPayload } from '@/types/product';

const BASE_URL = '/api/products';

// Vỏ bọc giống BE
type ApiResponse<T> = {
  data: T;
  message?: string;
  success?: boolean;
};

export async function getProducts(): Promise<Product[]> {
  const res = await apiFetch<ApiResponse<Product[]>>(BASE_URL);
  return res.data;
}

export async function getProduct(id: number): Promise<Product> {
  const res = await apiFetch<ApiResponse<Product>>(`${BASE_URL}/${id}`);
  return res.data;
}

export async function createProduct(payload: ProductPayload): Promise<Product> {
  const res = await apiFetch<ApiResponse<Product>>(BASE_URL, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return res.data;
}

export async function updateProduct(
  id: number,
  payload: ProductPayload,
): Promise<Product> {
  const res = await apiFetch<ApiResponse<Product>>(`${BASE_URL}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
  return res.data;
}

export async function deleteProduct(id: number): Promise<void> {
  await apiFetch<ApiResponse<null>>(`${BASE_URL}/${id}`, {
    method: 'DELETE',
  });
}

// ==== Upload hình ảnh sản phẩm ====

export async function uploadProductImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);

  const res = await apiFetch<ApiResponse<string>>(
    `${BASE_URL}/upload-image`,
    {
      method: 'POST',
      body: formData, // apiFetch đã handle FormData
    },
  );

  return res.data; // BE trả full URL
}
