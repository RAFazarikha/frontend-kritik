import { useState, useEffect } from 'react';
import { useAdminAuth } from '../../hooks/useAdminAuth';
import { fetchAdminStats, updateAdminStatus, deleteAdminConfess } from '../../hooks/useAdminStats';
import { useAdminConfesses } from '../../hooks/useAdminConfesses';
import Toast from '../components/Toast';

export default function AdminDashboard() {
  const { token, logout } = useAdminAuth();

  // 1. Panggil Hooks DENGAN BENAR di Level Teratas Komponen
  const { confesses = [], loading: confessesLoading, error: confessesError, retry } = useAdminConfesses(token);

  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [actionError, setActionError] = useState('');

  const [selectedConfess, setSelectedConfess] = useState(null);
  const [isDetailVisible, setIsDetailVisible] = useState(false);

  // 2. Jika useAdminStats adalah fungsi API biasa (bukan hook), panggil di useEffect
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setStatsLoading(true);
        const { data } = await fetchAdminStats(token);
        setStats(data);
      } catch (err) {
        setActionError('Gagal memuat statistik');
      } finally {
        setStatsLoading(false);
      }
    };
    if (token) fetchStats();
  }, [token]);

  // Gabungkan status loading dan error
  const isLoading = statsLoading || confessesLoading;
  const errorMsg = confessesError || actionError;

  const handleApprove = async (id) => {
    try {
      await updateAdminStatus(token, id, true);
      retry && retry(); // Refresh daftar confess
      setActionError('Berhasil disetujui');
    } catch (err) {
      setActionError('Gagal menyetujui');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Hapus confess ini? Tindakan ini tidak dapat dibatalkan.')) return;
    try {
      await deleteAdminConfess(token, id);
      retry && retry();
      setActionError('Berhasil dihapus');
    } catch (err) {
      setActionError('Gagal menghapus confess');
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm('Tolak confess ini?')) return;
    try {
      await updateAdminStatus(token, id, false);
      retry && retry();
      setActionError('Berhasil ditolak');
    } catch (err) {
      setActionError('Gagal menolak');
    }
  };

  if (isLoading) {
    return (
      <div className="admin-layout min-h-screen bg-[#0B1120] text-white">
        <div className="text-center py-8">Memuat Data Dashboard...</div>
      </div>
    );
  }

  return (
    <div className="admin-layout min-h-screen bg-[#0B1120] text-white p-6">
      <div className="admin-content max-w-7xl mx-auto">

        <div className="page-header flex justify-between items-center mb-8">
          <div className="page-title text-2xl font-bold">
            <span>📊</span> Admin Dashboard
          </div>
          <button
            onClick={logout}
            className="bg-red-600 hover:bg-red-700 text-white rounded-md text-sm py-2 px-4"
          >
            Logout🚪
          </button>
        </div>

        {errorMsg && <Toast type="error" message={errorMsg} />}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <StatsCard title="Total Confesses" value={stats?.totalConfesses} color="text-white" />
          <StatsCard title="Approved" value={stats?.approved} color="text-[#6EE7B7]" />
          <StatsCard title="Pending" value={stats?.pending} color="text-[#FDBA74]" />
          <StatsCard title="Total Love" value={stats?.totalLove} color="text-pink-400" />
        </div>

        <div className="bg-[#131C2F] rounded-lg overflow-hidden">
          {confesses.length > 0 ? (
            <table className="w-full text-left">
              <thead className="bg-[#1A2642]">
                <tr>
                  <th className="px-4 py-3 text-sm text-gray-400">Status</th>
                  <th className="px-4 py-3 text-sm text-gray-400">From</th>
                  <th className="px-4 py-3 text-sm text-gray-400">To</th>
                  <th className="px-4 py-3 text-sm text-gray-400">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {confesses.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-800">
                    <td className="px-4 py-3">{c.status}</td>
                    <td className="px-4 py-3">{c.from}</td>
                    <td className="px-4 py-3">{c.to}</td>
                    <td className="px-4 py-3 flex gap-2">
                      <button onClick={() => handleApprove(c.id)} className="bg-green-600 px-3 py-1 rounded text-xs">Setujui</button>
                      <button onClick={() => handleReject(c.id)} className="bg-yellow-600 px-3 py-1 rounded text-xs">Tolak</button>
                      <button onClick={() => handleDelete(c.id)} className="bg-red-600 px-3 py-1 rounded text-xs">Hapus</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-10 text-gray-400">Tidak ada confess yang ditemukan.</div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatsCard({ title, value, color }) {
  return (
    <div className="bg-[#131C2F] rounded-lg p-6 text-center border border-gray-800">
      <div className={`text-3xl font-bold ${color}`}>{value || 0}</div>
      <div className="text-sm text-gray-400 mt-2">{title}</div>
    </div>
  );
}