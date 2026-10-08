import { useState, useCallback, useEffect } from 'react';
import { adminLogin } from '@/lib/api/admin';

export interface UseAdminAuthReturn {
  token: string;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
  error: string;
}

export function useAdminAuth(): UseAdminAuthReturn {
  const [token, setToken] = useState<string>(() => {
    if (typeof window === 'undefined') return '';
    try {
      return sessionStorage.getItem('admin_token') || '';
    } catch {
      return '';
    }
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const login = useCallback(async (username: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError('');
    try {
      const { ok, payload } = await adminLogin(username, password);
      if (!ok) {
        setError(payload?.error || 'Login gagal');
        return false;
      }
      const t = payload?.token;
      if (!t) {
        setError('Token tidak ditemukan');
        return false;
      }
      sessionStorage.setItem('admin_token', t);
      setToken(t);
      return true;
    } catch {
      setError('Tidak bisa hubungi server');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('admin_token');
    }
    setToken('');
  }, []);

  useEffect(() => {
    const on401 = (e: Event) => {
      const customEvent = e as CustomEvent<number>;
      if (customEvent.detail === 401) logout();
    };

    window.addEventListener('admin:401', on401);
    return () => window.removeEventListener('admin:401', on401);
  }, [logout]);

  return { token, login, logout, loading, error };
}