import { request } from './confesses';
import type { Confess } from '@/types';

export interface AdminLoginPayload {
  token?: string;
  error?: string;
  [key: string]: unknown;
}

export interface ApiResponse<T = unknown> {
  success?: boolean;
  message?: string;
  data?: T;
  [key: string]: unknown;
}

export interface AdminGetConfessesParams {
  status?: string;
  limit?: number | string;
  page?: number | string;
  [key: string]: string | number | boolean | undefined;
}

// POST /api/admin/auth/login
export async function adminLogin(
  username: string,
  password: string
): Promise<{ ok: boolean; payload?: AdminLoginPayload }> {
  return request('/api/admin/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });
}

// GET /api/admin/confesses
export async function adminGetConfesses(
  token: string,
  params: AdminGetConfessesParams = {}
): Promise<{ ok: boolean; payload?: ApiResponse<Confess[]> }> {
  const cleanParams = Object.entries(params).reduce<Record<string, string>>(
    (acc, [key, value]) => {
      if (value !== undefined && value !== '') {
        acc[key] = String(value);
      }
      return acc;
    },
    {}
  );

  const qs = new URLSearchParams(cleanParams).toString();
  const endpoint = `/api/admin/confesses${qs ? `?${qs}` : ''}`;

  return request(endpoint, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

// POST /api/admin/confesses/:id/status
export async function adminUpdateStatus(
  token: string,
  id: string,
  status: string
): Promise<{ ok: boolean; payload?: ApiResponse<Confess> }> {
  return request(`/api/admin/confesses/${id}/status`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });
}