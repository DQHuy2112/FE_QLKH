// src/services/inventory.service.ts
const API_BASE =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8080';

export type ExportStatus =
    | 'PENDING'
    | 'APPROVED'
    | 'REJECTED'
    | 'EXPORTED'
    | 'RETURNED'
    | 'CANCELLED';

export interface SupplierExport {
    id: number;
    code: string;
    storeId: number;
    supplierId: number;
    status: ExportStatus;
    exportsDate: string;
    note?: string | null;
    totalValue: number;
    supplierName?: string | null;
}

type ApiResponse<T> = {
    data: T;
    message?: string;
    success?: boolean;
};

/** ===================== LIST PHIẾU XUẤT NCC ===================== */

export async function getSupplierExports(params?: {
    status?: ExportStatus | 'ALL';
    code?: string;
    fromDate?: string; // 'YYYY-MM-DD'
    toDate?: string;   // 'YYYY-MM-DD'
}): Promise<SupplierExport[]> {
    const qs = new URLSearchParams();

    if (params?.status && params.status !== 'ALL') {
        qs.set('status', params.status);
    }
    if (params?.code) {
        qs.set('code', params.code);
    }
    if (params?.fromDate) {
        qs.set('fromDate', params.fromDate);
    }
    if (params?.toDate) {
        qs.set('toDate', params.toDate);
    }

    const url =
        qs.toString() !== ''
            ? `${API_BASE}/api/exports/suppliers?${qs.toString()}`
            : `${API_BASE}/api/exports/suppliers`;

    // Lấy token nếu có
    const token =
        typeof window !== 'undefined'
            ? localStorage.getItem('token')
            : null;

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(url, {
        credentials: 'include',
        headers,
    });

    if (!res.ok) {
        throw new Error('Không lấy được danh sách phiếu xuất NCC');
    }

    const json: ApiResponse<SupplierExport[]> = await res.json();
    return json.data;
}

/** ===================== TẠO PHIẾU XUẤT NCC ===================== */
/**
 * match với ExportDetailRequest của BE:
 *  - importDetailId
 *  - productId
 *  - quantity
 *  - unitPrice
 */
export interface ExportDetailItemRequest {
    importDetailId: number;
    productId: number;
    quantity: number;
    unitPrice: number;
}

/**
 * match với SupplierExportRequest của BE:
 *  - code?: string
 *  - storeId: number
 *  - supplierId: number
 *  - note?: string
 *  - description?: string
 *  - items: ExportDetailItemRequest[]
 */
export interface SupplierExportCreateRequest {
    code?: string | null;
    storeId: number;
    supplierId: number;
    note?: string | null;
    description?: string | null;
    items: ExportDetailItemRequest[];
}

export async function createSupplierExport(
    payload: SupplierExportCreateRequest,
): Promise<SupplierExport> {
    const url = `${API_BASE}/api/exports/suppliers`;

    const token =
        typeof window !== 'undefined'
            ? localStorage.getItem('token')
            : null;

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(url, {
        method: 'POST',
        credentials: 'include',
        headers,
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        // cố gắng đọc message từ BE nếu có
        let msg = 'Không tạo được phiếu xuất kho';
        try {
            const json = (await res.json()) as { message?: string };
            if (json?.message) msg = json.message;
        } catch {
            // ignore
        }
        throw new Error(msg);
    }

    const json: ApiResponse<SupplierExport> = await res.json();
    return json.data;
}
