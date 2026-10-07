export async function fetchAdminStats(token) {
  const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/stats`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Gagal memuat statistik');
  const data = await res.json();
  return { data };
}

export async function updateAdminStatus(token, id, status) {
  const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/confesses/${id}/status`, {
    method: 'POST', // <-- DIGANTI MENJADI POST SESUAI DOKUMENTASI
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error('Gagal memperbarui status');
  return res.json();
}

export async function deleteAdminConfess(token, id) {
  const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/confesses/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Gagal menghapus');
  return res.json();
}