// src/lib/api-client.ts
const API_BASE_URL = 'http://localhost:8080'; // gateway

export async function apiFetch<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const token =
    typeof window !== 'undefined'
      ? localStorage.getItem('access_token')
      : null;

  // Dùng Record<string, string> để index được bằng ['Authorization']
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> | undefined),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers, // TS tự hiểu là HeadersInit được
  });

  if (!res.ok) {
    let message = `HTTP ${res.status}`;
    try {
      const data = (await res.json()) as { message?: string };
      if (data?.message) message = data.message;
    } catch {
      // ignore
    }
    throw new Error(message);
  }

  return (await res.json()) as T;
}







// src/lib/api-client.ts
// export async function apiFetch<T>(
//   url: string,
//   options: RequestInit = {}
// ): Promise<T> {
//   const baseUrl =
//     process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:8080';

//   const res = await fetch(`${baseUrl}${url}`, {
//     ...options,
//     headers: {
//       'Content-Type': 'application/json',
//       ...(options.headers || {}),
//     },
//     credentials: 'include',
//   });

//   if (!res.ok) {
//   let message = `HTTP ${res.status}`;

//   try {
//     const data: unknown = await res.json();

//     // type guard: kiểm tra object có field message là string hay không
//     if (
//       typeof data === 'object' &&
//       data !== null &&
//       'message' in data &&
//       typeof (data as { message: unknown }).message === 'string'
//     ) {
//       message = (data as { message: string }).message;
//     }
//   } catch {
//     // ignore parse error, giữ message mặc định
//   }

//   throw new Error(message);
// }


//   return res.json();
// }
