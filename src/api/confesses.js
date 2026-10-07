export const API_URL = import.meta.env.VITE_API_URL;

async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, options);
  let data = null;
  try {
    data = await res.json();
  } catch {
    /* empty body */
  }
  const payload = data?.data ?? data;
  return { ok: res.ok, status: res.status, data, payload };
}

export const getConfesses = async () => {
  const { ok, status, payload } = await request('/confesses');
  if (!ok) {
    const err = new Error('Gagal memuat confess');
    err.status = status;
    throw err;
  }
  return Array.isArray(payload) ? payload : [];
};

export const getConfess = (id) => request(`/confesses/${id}`);

export const createConfess = (payload) =>
  request('/confesses', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

export const loveConfess = (id) => request(`/confesses/${id}/love`, { method: 'POST' });