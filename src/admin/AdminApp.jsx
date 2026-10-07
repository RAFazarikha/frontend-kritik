import { useEffect } from 'react';
import { Outlet, Navigate, Route, Routes } from 'react-router-dom';
import { useAdminAuth } from '../hooks/useAdminAuth';
import Toast from './components/Toast';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminConfesses from './pages/AdminConfesses';
// Pastikan AdminLayout juga di-import jika berada di file terpisah

// 1. Pelindung Rute Dashboard (Tendang ke login jika belum ada token)
function ProtectedRoute({ children }) {
  const { token, loading } = useAdminAuth();

  // Wajib tunggu proses loading selesai sebelum melakukan redirect!
  if (loading) {
    return (
      <div className="admin-layout min-h-screen flex items-center justify-center bg-[#0B1120]">
        <div className="text-[#94A3B8]">Loading...</div>
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  return children || <Outlet />;
}

// 2. Pelindung Rute Login (Tendang ke dashboard jika SUDAH login)
function GuestRoute({ children }) {
  const { token, loading } = useAdminAuth();

  if (loading) {
    return (
      <div className="admin-layout min-h-screen flex items-center justify-center bg-[#0B1120]">
        <div className="text-[#94A3B8]">Loading...</div>
      </div>
    );
  }

  if (token) {
    return <Navigate to="/admin" replace />;
  }

  return children || <Outlet />;
}

export default function AdminApp() {
  const { error } = useAdminAuth();

  // Event listener global untuk error 401 API
  useEffect(() => {
    const on401 = (e) => {
      if (e.detail === 401) {
        window.location.href = '/admin/login';
      }
    };
    window.addEventListener('admin:401', on401);
    return () => window.removeEventListener('admin:401', on401);
  }, []);

  return (
    <div>
      <Routes>
        {/* Rute Login dibungkus GuestRoute */}
        <Route
          path="/admin/login"
          element={
            <GuestRoute>
              <AdminLogin />
            </GuestRoute>
          }
        />

        {/* Rute Admin dibungkus ProtectedRoute */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <LayoutWrapper />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/confesses"
          element={
            <ProtectedRoute>
              <ConfessesWrapper />
            </ProtectedRoute>
          }
        />

        {/* Fallback otomatis ke halaman utama admin */}
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>

      {error && <Toast type="error" message={error} />}
    </div>
  );
}

function LayoutWrapper() {
  return <AdminDashboard />;
}

function ConfessesWrapper() {
  return <AdminConfesses />;
}