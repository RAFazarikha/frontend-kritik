import { request } from './confesses';

export async function adminLogin(username, password) {
  return request('/admin/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
}

export async function adminGetStats(token) {
  return request('/admin/stats', {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function adminGetConfesses(token, params = {}) {
  const qs = new URLSearchParams(params).toString();
  return request(`/admin/confesses${qs ? `?${qs}` : ''}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function adminGetConfess(token, id) {
  return request(`/admin/confesses/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function adminUpdateStatus(token, id, isApproved) {
  return request(`/admin/confesses/${id}/status`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ isApproved }),
  });
}

export async function adminDeleteConfess(token, id) {
  return request(`/admin/confesses/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
}