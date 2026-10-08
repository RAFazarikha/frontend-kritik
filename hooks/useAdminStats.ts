import type { Confess } from '@/types';

export interface AdminStatsData {
  totalConfesses?: number;
  approvedCount?: number;
  pendingCount?: number;
  rejectedCount?: number;
  totalLoves?: number;
  [key: string]: unknown;
}

export interface AdminStatsResponse {
  data: AdminStatsData;
}

export interface ApiResponse<T = unknown> {
  success?: boolean;
  message?: string;
  data?: T;
  [key: string]: unknown;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function fetchAdminStats(token: string): Promise<AdminStatsResponse> {
  const res = await fetch(`${BASE_URL}/api/admin/stats`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    if (res.status === 401 && typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('admin:401', { detail: 401 }));
    }
    throw new Error('Gagal memuat statistik');
  }

  const data = await res.json();
  return { data: data.data || data };
}

export async function updateAdminStatus(
  token: string,
  id: string,
  status: string
): Promise<ApiResponse<Confess>> {
  const res = await fetch(`${BASE_URL}/api/admin/confesses/${id}/status`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });

  if (!res.ok) {
    if (res.status === 401 && typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('admin:401', { detail: 401 }));
    }
    throw new Error('Gagal memperbarui status');
  }

  return res.json();
}

export async function deleteAdminConfess(
  token: string,
  id: string
): Promise<ApiResponse> {
  const res = await fetch(`${BASE_URL}/api/admin/confesses/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    if (res.status === 401 && typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('admin:401', { detail: 401 }));
    }
    throw new Error('Gagal menghapus confess');
  }

  return res.json();
}