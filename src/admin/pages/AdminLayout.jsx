import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AdminConfesses from '../pages/AdminConfesses';
import { useAdminAuth } from '../../hooks/useAdminAuth';
import Toast from './Toast';

export default function AdminLayout() {
  const { token, error } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!token && location.pathname !== '/admin/login') {
      navigate('/admin/login');
    }
  }, [token, location.pathname, navigate]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B1120]">
        <div className="text-center py-8">
          <div className="text-6xl font-bold text-red-500 mb-4">⛔</div>
          <p className="text-xl text-white">Gagal mengakses</p>
          <p className="text-sm text-gray-400">Akun atau token tidak valid</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-layout min-h-screen">
      <div className="admin-content">
        <div className="page-header">
          <div className="page-title">
            <span>💌</span> Admin Dashboard
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <div className="status status.pending">Pending</div>
            </div>
            <button
              onClick={() => navigate('/admin/login')}
              className="ml-4 btn btn-ghost rounded-md text-sm py-1 px-2.5 text-[#94A3B8]"
              aria-label="Logout"
            >
              🚪
            </button>
          </div>
        </div>
        <div className="filter-row">
          <select
            className="filter-select"
            onChange={(e) => {
              const status = e.target.value;
              // Would call a hook to refresh data
            }}
          >
            <option value="all">Semua</option>
            <option value="approved">Disetujui</option>
            <option value="pending">Menunggu</option>
            <option value="rejected">Ditolak</option>
          </select>
          <input
            type="text"
            placeholder="Cari..."
            className="filter-input"
            onChange={(e) => {
              const search = e.target.value;
              // Would call a hook to filter
            }}
          />
        </div>
        {error && <Toast type="error" message={error} />}
        {/* Stats and confesses list would go here */}
      </div>
    </div>
  );
}
