import { useState, useEffect, useCallback } from 'react';

export function useAdminConfesses(token, params = {}) {
  const [confesses, setConfesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadConfesses = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const url = new URL(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/confesses`);
      if (params.status) url.searchParams.append('status', params.status);
      if (params.limit) url.searchParams.append('limit', params.limit);

      const res = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Gagal memuat confesses');
      const data = await res.json();

      // Sesuaikan jika backend mengembalikan object { data: [...] } atau array langsung [...]
      setConfesses(data.data || data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token, params.status, params.limit]);

  useEffect(() => {
    loadConfesses();
  }, [loadConfesses]);

  return { confesses, loading, error, retry: loadConfesses };
}