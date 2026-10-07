import { useState, useEffect } from 'react';
import axios from 'axios';
import StickyNote from './StickyNote';

const API = 'http://localhost:5000/api';

export default function AdminPage({ onLogout }) {
  const [data, setData] = useState({ stats: { total: 0, approved: 0, pending: 0 }, notes: [] });
  const [tab, setTab] = useState('all');
  const [error, setError] = useState('');

  const load = async () => {
    try {
      const token = sessionStorage.getItem('adminToken');
      const res = await axios.get(`${API}/admin/notes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData(res.data);
      setError('');
    } catch (err) {
      setError(err.response?.status === 401 ? 'Token salah. Coba lagi.' : 'Gagal memuat data.');
    }
  };

  useEffect(() => { load(); }, []);

  const setApproval = async (id, isApproved) => {
    const token = sessionStorage.getItem('adminToken');
    await axios.patch(`${API}/admin/notes/${id}`, { isApproved }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    load();
  };

  const remove = async (id) => {
    if (!confirm('Hapus catatan ini permanen?')) return;
    const token = sessionStorage.getItem('adminToken');
    await axios.delete(`${API}/admin/notes/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    load();
  };

  const notes = tab === 'all' ? data.notes
    : tab === 'approved' ? data.notes.filter((n) => n.isApproved)
    : data.notes.filter((n) => !n.isApproved);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">🛡️ Admin — Kritik & Saran</h1>
        <button onClick={onLogout} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm">
          Keluar
        </button>
      </header>

      {error && <p className="text-red-400 mb-4">{error}</p>}

      <div className="flex gap-4 mb-6">
        {[['all', `Semua (${data.stats.total})`], ['approved', `Disetujui (${data.stats.approved})`], ['pending', `Pending (${data.stats.pending})`]].map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${tab === key ? 'bg-amber-500 text-gray-900' : 'bg-gray-800 hover:bg-gray-700'}`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="text-left text-gray-400 border-b border-gray-700">
              <th className="py-2 pr-4">Konten</th>
              <th className="py-2 pr-4">IP</th>
              <th className="py-2 pr-4">Perangkat</th>
              <th className="py-2 pr-4">Resolusi</th>
              <th className="py-2 pr-4">User Agent</th>
              <th className="py-2 pr-4">Tanggal</th>
              <th className="py-2 pr-4">Status</th>
              <th className="py-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {notes.map((note) => (
              <tr key={note.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                <td className="py-3 pr-4 max-w-xs">
                  <span className="mr-1">{note.sticker === 'bulb' ? '💡' : note.sticker === 'fire' ? '🔥' : note.sticker === 'heart' ? '❤️' : note.sticker === 'star' ? '⭐' : ''}</span>
                  {note.content}
                </td>
                <td className="py-3 pr-4 font-mono text-xs">{note.ipAddress}</td>
                <td className="py-3 pr-4">{note.deviceType}</td>
                <td className="py-3 pr-4 text-xs">{note.screenRes || '-'}</td>
                <td className="py-3 pr-4 text-xs max-w-[200px] truncate" title={note.userAgent}>{note.userAgent}</td>
                <td className="py-3 pr-4 text-xs">{new Date(note.createdAt).toLocaleString('id-ID')}</td>
                <td className="py-3 pr-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${note.isApproved ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'}`}>
                    {note.isApproved ? '✓ Disetujui' : '⏳ Pending'}
                  </span>
                </td>
                <td className="py-3 whitespace-nowrap">
                  <button onClick={() => setApproval(note.id, !note.isApproved)} className="text-blue-400 hover:text-blue-300 text-xs mr-3">
                    {note.isApproved ? 'Batalkan' : 'Setujui'}
                  </button>
                  <button onClick={() => remove(note.id)} className="text-red-400 hover:text-red-300 text-xs">
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {notes.length === 0 && <p className="text-gray-500 mt-8 text-center">Tidak ada catatan.</p>}
      </div>
    </div>
  );
}