// // src/lib/api-client.ts
// export async function apiFetch<T>(url: string, options: RequestInit = {}): Promise<T> {
//   const token = typeof window !== 'undefined'
//     ? localStorage.getItem('token')
//     : null;

//   const headers: HeadersInit = {
//     'Content-Type': 'application/json',
//     ...(token ? { Authorization: `Bearer ${token}` } : {}),
//     ...(options.headers || {}),
//   };

//   const res = await fetch(url, {
//     ...options,
//     headers,
//   });

//   if (!res.ok) {
//     const text = await res.text();
//     throw new Error(text || 'API error');
//   }

//   return res.json();
// }





// src/lib/api-client.ts
export async function apiFetch<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:8080';

  const res = await fetch(`${baseUrl}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    credentials: 'include',
  });

  if (!res.ok) {
  let message = `HTTP ${res.status}`;

  try {
    const data: unknown = await res.json();

    // type guard: kiểm tra object có field message là string hay không
    if (
      typeof data === 'object' &&
      data !== null &&
      'message' in data &&
      typeof (data as { message: unknown }).message === 'string'
    ) {
      message = (data as { message: string }).message;
    }
  } catch {
    // ignore parse error, giữ message mặc định
  }

  throw new Error(message);
}


  return res.json();
}
