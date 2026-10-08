import type { Confess } from '@/types';

export const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

export interface RequestOptions extends RequestInit {
  headers?: Record<string, string>;
}

export interface RequestResult<T = unknown> {
  ok: boolean;
  status: number;
  data: unknown;
  payload: T;
}

export interface CreateConfessPayload {
  from: string;
  to: string;
  category: string;
  message: string;
}

export async function request<T = unknown>(
  path: string,
  options: RequestOptions = {}
): Promise<RequestResult<T>> {
  const res = await fetch(`${API_URL}${path}`, options);
  let data: unknown = null;
  try {
    data = await res.json();
  } catch {
    /* empty body */
  }

  const payload = (data as { data?: T })?.data ?? (data as T);
  return { ok: res.ok, status: res.status, data, payload };
}

// GET /api/confesses
export const getConfesses = async (): Promise<Confess[]> => {
  const { ok, status, payload } = await request<Confess[]>('/api/confesses');
  if (!ok) {
    const err = new Error('Gagal memuat confess') as Error & { status?: number };
    err.status = status;
    throw err;
  }
  return Array.isArray(payload) ? payload : [];
};

// GET /api/confesses/:id
export const getConfessDetail = async (id: string): Promise<Confess | null> => {
  const { ok, payload } = await request<Confess>(`/api/confesses/${id}`);
  if (!ok) return null;
  return payload;
};

// POST /api/confesses
export const createConfess = (payload: CreateConfessPayload) =>
  request<Confess>('/api/confesses', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

// POST /api/confesses/:id/love
export const loveConfess = (id: string) =>
  request<{ loveCount: number }>(`/api/confesses/${id}/love`, {
    method: 'POST',
  });