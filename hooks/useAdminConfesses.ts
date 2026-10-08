import { useState, useEffect, useCallback } from 'react';
import type { Confess } from '@/types';

export interface AdminConfessesParams {
  status?: string;
  limit?: number | string;
}

export interface UseAdminConfessesReturn {
  confesses: Confess[];
  loading: boolean;
  error: string;
  retry: () => Promise<void>;
}

export default function useAdminConfesses(
  token: string,
  params: AdminConfessesParams = {}
): UseAdminConfessesReturn {
  const [confesses, setConfesses] = useState<Confess[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const status = params.status;
  const limit = params.limit;

  const loadConfesses = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
      const url = new URL(`${baseUrl}/api/admin/confesses`);

      if (status) url.searchParams.append('status', status);
      if (limit) url.searchParams.append('limit', String(limit));

      const res = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (res.status === 401) {
        if (typeof window !== 'undefined') {
          window.dispatchEvent(
            new CustomEvent('admin:401', { detail: 401 })
          );
        }
        throw new Error('Sesi telah berakhir, silakan login kembali');
      }

      if (!res.ok) {
        throw new Error('Gagal memuat daftar confess');
      }

      const responseData = await res.json();
      const list: Confess[] = Array.isArray(responseData?.data)
        ? responseData.data
        : Array.isArray(responseData)
        ? responseData
        : [];

      setConfesses(list);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Terjadi kesalahan tidak terduga';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [token, status, limit]);

  useEffect(() => {
    loadConfesses();
  }, [loadConfesses]);

  return {
    confesses,
    loading,
    error,
    retry: loadConfesses,
  };
}