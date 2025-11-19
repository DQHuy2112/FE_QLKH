import { getToken } from "@/lib/auth";

const API_BASE =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

export type ExportStatus =
    | "PENDING"
    | "APPROVED"
    | "REJECTED"
    | "EXPORTED"
    | "RETURNED"
    | "CANCELLED";

export interface ImportLot {
    id: number;                 // import_details_id
    importId: number;           // imports_id
    importCode: string;         // mã phiếu nhập
    importsDate: string;        // ngày nhập
    productId: number;
    quantity: number;           // số lượng đã nhập
    remainingQuantity: number;  // số lượng còn lại có thể xuất
    unitPrice: number;
}

export interface SupplierExportDetail {
    id?: number;
    exportDetailId?: number;
    importDetailsId?: number;   // ⭐ THÊM: ID lô nhập
    productId: number;
    productCode?: string | null;
    productName?: string | null;
    unit?: string | null;
    unitName?: string | null;
    quantity: number;
    unitPrice: number;
}

export interface SupplierExport {
    id: number;
    code: string;
    storeId: number;
    supplierId: number;
    supplierCode?: string | null;
    supplierPhone?: string | null;
    supplierAddress?: string | null;
    status: ExportStatus;
    exportsDate: string;
    note?: string | null;
    description?: string | null;
    totalValue: number;
    supplierName?: string | null;
    attachmentImages?: string[];
    items?: SupplierExportDetail[];
}

type ApiResponse<T> = {
    data: T;
    message?: string;
    success?: boolean;
};

/* ============================================================
   LẤY DANH SÁCH PHIẾU XUẤT NCC
============================================================ */
export async function getSupplierExports(params?: {
    status?: ExportStatus | "ALL";
    code?: string;
    fromDate?: string;
    toDate?: string;
}): Promise<SupplierExport[]> {
    const qs = new URLSearchParams();

    if (params?.status && params.status !== "ALL") {
        qs.set("status", params.status);
    }
    if (params?.code) qs.set("code", params.code);
    if (params?.fromDate) qs.set("fromDate", params.fromDate);
    if (params?.toDate) qs.set("toDate", params.toDate);

    const url =
        qs.toString() === ""
            ? `${API_BASE}/api/exports/suppliers`
            : `${API_BASE}/api/exports/suppliers?${qs.toString()}`;

    const token = getToken();
    const headers: HeadersInit = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(url, {
        credentials: "include",
        headers,
    });

    if (!res.ok) {
        throw new Error("Không lấy được danh sách phiếu xuất NCC");
    }

    const json: ApiResponse<SupplierExport[]> = await res.json();
    return json.data;
}

/* ============================================================
   TẠO PHIẾU XUẤT NCC
============================================================ */
export interface ExportDetailItemRequest {
    importDetailsId: number;    // ⭐ Bắt buộc: ID lô nhập
    productId: number;
    quantity: number;
    unitPrice: number;
}

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

    const token = getToken();
    const headers: HeadersInit = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(url, {
        method: "POST",
        credentials: "include",
        headers,
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        let msg = "Không tạo được phiếu xuất kho";
        try {
            const j = (await res.json()) as { message?: string };
            if (j.message) msg = j.message;
        } catch {
            // ignore
        }
        throw new Error(msg);
    }

    const json: ApiResponse<SupplierExport> = await res.json();
    return json.data;
}

/* Lấy chi tiết phiếu xuất NCC */
export async function getSupplierExportById(
    id: number,
): Promise<SupplierExport> {
    const url = `${API_BASE}/api/exports/suppliers/${id}`;

    const token = getToken();
    const headers: HeadersInit = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(url, {
        method: "GET",
        credentials: "include",
        headers,
    });

    if (!res.ok) {
        throw new Error("Không lấy được chi tiết phiếu xuất NCC");
    }

    const json: ApiResponse<SupplierExport> = await res.json();
    return json.data;
}

/* Lấy danh sách lô nhập còn tồn của 1 sản phẩm */
export async function getImportLotsByProduct(
    productId: number,
): Promise<ImportLot[]> {
    const url = `${API_BASE}/api/imports/suppliers/lots?productId=${productId}`;

    const token = getToken();
    const headers: HeadersInit = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(url, {
        method: "GET",
        credentials: "include",
        headers,
    });

    if (!res.ok) {
        throw new Error("Không lấy được danh sách lô nhập");
    }

    const json: ApiResponse<ImportLot[]> = await res.json();
    return json.data;
}

/* Cập nhật phiếu xuất NCC */
export async function updateSupplierExport(
    id: number,
    payload: SupplierExportCreateRequest,
): Promise<SupplierExport> {
    const url = `${API_BASE}/api/exports/suppliers/${id}`;

    const token = getToken();
    const headers: HeadersInit = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(url, {
        method: "PUT",
        credentials: "include",
        headers,
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        let msg = "Không cập nhật được phiếu xuất NCC";
        try {
            const j = (await res.json()) as { message?: string };
            if (j.message) msg = j.message;
        } catch {
            // ignore
        }
        throw new Error(msg);
    }

    const json: ApiResponse<SupplierExport> = await res.json();
    return json.data;
}

/* ============================================================
   IMPORT NCC
============================================================ */

export interface SupplierImportDetail {
    id?: number;
    importDetailId?: number;

    productId: number;
    productCode?: string | null;
    productName?: string | null;

    unit?: string | null;
    unitName?: string | null;

    quantity: number;
    unitPrice: number;
}

export interface SupplierImport {
    id: number;
    code: string;

    storeId: number;
    supplierId: number;

    supplierName: string | null;
    supplierCode?: string | null;
    supplierPhone?: string | null;
    supplierAddress?: string | null;

    status: ExportStatus;
    importsDate: string;

    note: string | null;
    description?: string | null;

    totalValue: number;
    attachmentImages?: string[];
    items?: SupplierImportDetail[];
}

export interface SupplierImportItemRequest {
    productId: number;
    quantity: number;
    unitPrice: number;
}

export interface SupplierImportCreateRequest {
    code?: string;
    storeId: number;
    supplierId: number;
    note?: string;
    description?: string;
    attachmentImages?: string[];
    items: SupplierImportItemRequest[];
}

/* Lấy danh sách phiếu nhập NCC */
export async function getSupplierImports(params?: {
    status?: ExportStatus | "ALL";
    code?: string;
    fromDate?: string;
    toDate?: string;
}): Promise<SupplierImport[]> {
    const qs = new URLSearchParams();

    if (params?.status && params.status !== "ALL") {
        qs.set("status", params.status);
    }
    if (params?.code) qs.set("code", params.code);
    if (params?.fromDate) qs.set("from", params.fromDate);
    if (params?.toDate) qs.set("to", params.toDate);

    const url =
        `${API_BASE}/api/imports/suppliers` +
        (qs.toString() ? `?${qs.toString()}` : "");

    const token = getToken();
    const headers: HeadersInit = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(url, {
        method: "GET",
        credentials: "include",
        headers,
    });

    if (!res.ok) {
        throw new Error("Không lấy được danh sách phiếu nhập NCC");
    }

    const json: ApiResponse<SupplierImport[]> = await res.json();
    return json.data;
}

/* Tạo phiếu nhập NCC */
export async function createSupplierImport(
    payload: SupplierImportCreateRequest,
): Promise<SupplierImport> {
    const url = `${API_BASE}/api/imports/suppliers`;

    const token = getToken();
    const headers: HeadersInit = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(url, {
        method: "POST",
        credentials: "include",
        headers,
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        let msg = "Không tạo được phiếu nhập NCC";
        try {
            const j = (await res.json()) as { message?: string };
            if (j.message) msg = j.message;
        } catch {
            // ignore
        }
        throw new Error(msg);
    }

    const json: ApiResponse<SupplierImport> = await res.json();
    return json.data;
}

/* Lấy chi tiết phiếu nhập */
export async function getSupplierImportById(
    id: number,
): Promise<SupplierImport> {
    // Thử thêm query param để backend include items
    const url = `${API_BASE}/api/imports/suppliers/${id}?includeDetails=true`;

    const token = getToken();
    const headers: HeadersInit = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(url, {
        method: "GET",
        credentials: "include",
        headers,
    });

    if (!res.ok) {
        throw new Error("Không lấy được chi tiết phiếu nhập NCC");
    }

    const json: ApiResponse<SupplierImport> = await res.json();
    return json.data;
}

/* Lấy chi tiết sản phẩm của phiếu nhập */
export async function getSupplierImportDetails(
    id: number,
): Promise<SupplierImportDetail[]> {
    const url = `${API_BASE}/api/imports/suppliers/${id}/details`;

    const token = getToken();
    const headers: HeadersInit = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(url, {
        method: "GET",
        credentials: "include",
        headers,
    });

    if (!res.ok) {
        // Nếu endpoint không tồn tại, trả về mảng rỗng
        console.warn("Không lấy được chi tiết sản phẩm của phiếu nhập");
        return [];
    }

    const json: ApiResponse<SupplierImportDetail[]> = await res.json();
    return json.data;
}

/* Wrapper cho trang EDIT – cho đúng tên hàm đang dùng ở FE */
export async function getSupplierImport(
    id: number,
): Promise<SupplierImport> {
    return getSupplierImportById(id);
}

/* Cập nhật phiếu nhập */
export async function updateSupplierImport(
    id: number,
    payload: SupplierImportCreateRequest,
): Promise<SupplierImport> {
    const url = `${API_BASE}/api/imports/suppliers/${id}`;

    const token = getToken();
    const headers: HeadersInit = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(url, {
        method: "PUT",
        credentials: "include",
        headers,
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        let msg = "Không cập nhật được phiếu nhập NCC";
        try {
            const j = (await res.json()) as { message?: string };
            if (j.message) msg = j.message;
        } catch {
            // ignore
        }
        throw new Error(msg);
    }

    const json: ApiResponse<SupplierImport> = await res.json();
    return json.data;
}
