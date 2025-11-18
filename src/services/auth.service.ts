import { apiFetch } from '@/lib/api-client';
import { LoginRequest, LoginResponse } from '@/types/auth';

export async function login(data: LoginRequest): Promise<LoginResponse> {
  return apiFetch<LoginResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
