import { useState, useEffect } from 'react';
import { useAdminAuth } from '../../hooks/useAdminAuth';
import { useAdminConfesses } from '../../hooks/useAdminConfesses';
import { fetchAdminStats, updateAdminStatus, deleteAdminConfess } from '../../hooks/useAdminStats';
import Toast from '../components/Toast';

export default function AdminConfesses() {
  const { token, error: authError } = useAdminAuth();
  const { confesses, loading, error, retry } = useAdminConfesses(token);
  const [selectedConfess, setSelectedConfess] = useState(null);
  const [isDetailVisible, setIsDetailVisible] = useState(false);
  const [formError, setFormError] = useState('');

  const handleApprove = async (id) => {
    try {
      await useAdminUpdateStatus(token, id, 'Approved');
      retry();
      if (selectedConfess?.id === id) {
        setSelectedConfess((prev) => ({ ...prev, status: 'Approved' }));
      }
      setFormError('Berhasil disetujui');
    } catch (err) {
      setFormError('Gagal menyetujui');
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm('Tolak confess ini?')) return;
    try {
      await useAdminUpdateStatus(token, id, 'Rejected');
      retry();
      setFormError('Berhasil ditolak');
    } catch (err) {
      setFormError('Gagal menolak');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Hapus confess ini? Tindakan ini tidak dapat dibatalkan.')) return;
    try {
      await useAdminDeleteConfess(token, id);
      retry();
      if (selectedConfess?.id === id) {
        setSelectedConfess(null);
        setIsDetailVisible(false);
      }
      setFormError('Berhasil dihapus');
    } catch (err) {
      setFormError('Gagal menghapus');
    }
  };

  const handleView = (confess) => {
    setSelectedConfess(confess);
    setIsDetailVisible(true);
    setFormError('');
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="admin-layout min-h-screen">
      <div className="admin-content">
        <div className="page-header">
          <div className="page-title">
            <span>💌</span> Admin Confesses
          </div>
          <div className="flex items-center">
            <div className="flex items-center gap-2">
              <div className="status status.pending">Pending</div>
            </div>
            <button
              onClick={() => window.location.href = '/admin/login'}
              className="ml-4 btn btn-ghost rounded-md text-sm py-1 px-2.5 text-[#94A3B8]"
              aria-label="Logout"
            >
              🚪
            </button>
          </div>
        </div>

        {(authError || error || formError) && (
          <Toast type="error" message={authError || error || formError} />
        )}

        {confesses.length > 0 ? (
          <div className="table">
            <thead>
              <tr>
                <th className="text-left text-xs font-bold text-[#94A3B8] px-4 py-2 border-b">Status</th>
                <th className="text-left text-xs font-bold text-[#94A3B8] px-4 py-2 border-b">From</th>
                <th className="text-left text-xs font-bold text-[#94A3B8] px-4 py-2 border-b">To</th>
                <th className="text-left text-xs font-bold text-[#94A3B8] px-4 py-2 border-b">Category</th>
                <th className="text-left text-xs font-bold text-[#94A3B8] px-4 py-2 border-b">Love</th>
                <th className="text-left text-xs font-bold text-[#94A3B8] px-4 py-2 border-b">Date</th>
                <th className="text-left text-xs font-bold text-[#94A3B8] px-4 py-2 border-b">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {confesses.map((confess) => (
                <tr key={confess.id} className="hover:bg-[#131C2F]">
                  <td className="text-center py-2">
                    <span className={`status ${confess.status}`}>{confess.status}</span>
                  </td>
                  <td className="text-center py-2">{confess.from}</td>
                  <td className="text-center py-2">{confess.to}</td>
                  <td className="text-center py-2">
                    <span className="badge" style={{ background: '#7C3AED' }}>{confess.categoryIcon}</span>
                  </td>
                  <td className="text-center py-2">{confess.loveCount}</td>
                  <td className="text-center py-2">
                    <span className="text-sm text-[#94A3B8]">
                      {new Date(confess.createdAt).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="text-center py-2">
                    <button onClick={() => handleView(confess)} className="btn btn-ghost">View</button>
                    <button onClick={() => handleApprove(confess.id)} className="btn btn-success">Approve</button>
                    <button onClick={() => handleDelete(confess.id)} className="btn btn-danger">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </div>
        ) : (
          <div className="empty">
            <div className="empty-icon">💌</div>
            <p className="text-center text-[#64748B]">Tidak ada confess</p>
          </div>
        )}
      </div>

      {isDetailVisible && selectedConfess && (
        <div className="modal-overlay" onClick={() => setIsDetailVisible(false)}>
          <div
            className="modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-label="Confess Detail"
          >
            <div className="modal-header">
              <div className="modal-title">
                <span>{selectedConfess.categoryIcon}</span>
                <span className="ml-2">{selectedConfess.from} → {selectedConfess.to}</span>
              </div>
              <button
                onClick={() => setIsDetailVisible(false)}
                className="btn btn-ghost float-right"
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <div className="detail-row">
                <div className="detail-label">Status</div>
                <div className="detail-value">{selectedConfess.status}</div>
              </div>
              <div className="detail-row">
                <div className="detail-label">Message</div>
                <div className="detail-value">{selectedConfess.message}</div>
              </div>
              {selectedConfess.status === 'Pending' && (
                <div className="detail-row">
                  <div className="detail-label">Actions</div>
                  <div className="detail-value">
                    <button
                      onClick={() => handleApprove(selectedConfess.id)}
                      className="btn btn-success mr-2"
                    >
                      ✓ Setujui
                    </button>
                    <button
                      onClick={() => handleReject(selectedConfess.id)}
                      className="btn btn-danger"
                    >
                      Tolak
                    </button>
                  </div>
                </div>
              )}
              <div className="detail-row">
                <div className="detail-label">Created At</div>
                <div className="detail-value">
                  {new Date(selectedConfess.createdAt).toLocaleString()}
                </div>
              </div>
              <div className="detail-row">
                <div className="detail-label">Metadata</div>
                <div className="detail-value">
                  <div><strong>IP:</strong> {selectedConfess.ip}</div>
                  <div><strong>Device:</strong> {selectedConfess.deviceType}</div>
                  <div><strong>Screen:</strong> {selectedConfess.screenResolution}</div>
                  <div><strong>User Agent:</strong> {selectedConfess.userAgent}</div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                onClick={() => setIsDetailVisible(false)}
                className="btn btn-ghost"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}