// src/services/supplier.service.ts
const API_BASE =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

export interface Supplier {
    id: number;      // map với supplierId trong DB
    code?: string;
    name: string;
}

type ApiResponse<T> = {
    data: T;
    message?: string;
    success?: boolean;
};

export async function getSuppliers(): Promise<Supplier[]> {
    // Lấy token từ localStorage (chỉ chạy ở client)
    const token =
        typeof window !== "undefined"
            ? localStorage.getItem("token")
            : null;

    const headers: HeadersInit = {
        "Content-Type": "application/json",
    };

    // Nếu có token thì gắn Authorization
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE}/api/exports/suppliers`, {
        credentials: "include",
        headers,
    });

    if (!res.ok) {
        throw new Error("Không lấy được danh sách nhà cung cấp");
    }

    const json: ApiResponse<Supplier[]> = await res.json();
    return json.data;
}
