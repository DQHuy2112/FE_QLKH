export interface Product {
  id: number;
  code: string;
  name: string;
  shortDescription?: string;
  image?: string | null;
  unitPrice: number;
  quantity: number;
  minStock?: number | null;   // 👈 THÊM
  maxStock?: number | null;   // 👈 THÊM
  categoryName: string | null;
  status: string;
  categoryId?: number | null;
  supplierId?: number | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductPayload {
  code: string;
  name: string;
  shortDescription?: string;
  image?: string | null;
  unitPrice: number;
  quantity: number;
  minStock?: number | null;   // 👈 THÊM
  maxStock?: number | null;   // 👈 THÊM
  status: string;
  categoryId?: number | null;
  supplierId?: number | null;
}
