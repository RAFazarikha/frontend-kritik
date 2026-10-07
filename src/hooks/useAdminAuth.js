import { useState, useCallback, useEffect } from "react";

export function useAdminAuth() {
  const [token, setToken] = useState(() => {
    try {
      return sessionStorage.getItem('admin_token') || '';
    } catch {
      return '';
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const login = useCallback(async (username, password) => {
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
    sessionStorage.removeItem('admin_token');
    setToken('');
  }, []);

  useEffect(() => {
    const on401 = (e) => {
      if (e.detail === 401) logout();
    };
    window.addEventListener('admin:401', on401);
    return () => window.removeEventListener('admin:401', on401);
  }, [logout]);

  return { token, login, logout, loading, error };
}

function adminLogin(u, p) {
  return fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: u, password: p }),
  }).then(r => r.json().then(d => ({ ok: r.ok, payload: d })));
}