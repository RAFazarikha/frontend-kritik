'use client';

import { useState, useEffect } from 'react';
import useAdminConfesses from '@/hooks/useAdminConfesses';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import type { Confess } from '@/types';

export default function AdminConfessesPage() {
  const { token } = useAdminAuth();
  const { confesses, loading, error, retry } = useAdminConfesses(token);
  const [selected, setSelected] = useState<Confess | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (selected) setSelected(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selected]);

  const openDetail = (confess: Confess) => {
    setSelected(confess);
  };

  const closeDetail = () => setSelected(null);

  const handleStatusUpdate = async (id: string, newStatus: 'approved' | 'rejected') => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
      const res = await fetch(`${baseUrl}/api/admin/confesses/${id}/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error('Gagal memperbarui status confess');
      retry();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Terjadi kesalahan';
      alert(message);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-100 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-rose-200 border-t-rose-500"></div>
          <p className="text-sm text-stone-500">Memuat data admin...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-100 flex-col items-center justify-center gap-4">
        <p className="text-sm text-rose-500">Gagal memuat: {error}</p>
        <button
          onClick={retry}
          className="rounded-full bg-rose-500 px-5 py-2 font-semibold text-white transition hover:bg-rose-600"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-rose-950">
          Manajemen Confess
        </h1>
        <p className="mt-1 text-stone-600">Kelola dan moderasi confess yang masuk</p>
      </div>

      {confesses.length === 0 ? (
        <div className="flex min-h-75 flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-rose-200 bg-white/50 p-8">
          <p className="text-sm text-stone-500">Belum ada confess.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {confesses.map((c) => (
            <div
              key={c.id}
              className="group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-rose-100 bg-white p-5 shadow-sm transition-all hover:border-rose-200 hover:shadow-md"
              onClick={() => openDetail(c)}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-3 py-1 text-xs font-medium capitalize text-rose-600">
                  {c.category}
                </span>
                <span className="flex items-center gap-1 text-xs text-stone-400">
                  ❤️ {c.loveCount ?? 0}
                </span>
              </div>
              <div className="mt-4">
                <p className="text-xs text-stone-500">
                  Dari <span className="font-semibold text-stone-700">
                    {c.from === 'Anonim' ? 'A****m' : c.from}
                  </span>
                </p>
                <p className="text-xs text-stone-500">
                  Untuk <span className="font-semibold text-stone-700">{c.to}</span>
                </p>
              </div>
              <p className="mt-3 line-clamp-3 text-base font-medium leading-relaxed text-stone-800">
                {c.message}
              </p>
              <div className="mt-4 flex items-center justify-between border-t border-rose-50 pt-4">
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStatusUpdate(c.id, 'approved');
                    }}
                    className="rounded-full bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700 transition hover:bg-green-100"
                  >
                    Setujui
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStatusUpdate(c.id, 'rejected');
                    }}
                    className="rounded-full bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 transition hover:bg-red-100"
                  >
                    Tolak
                  </button>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    openDetail(c);
                  }}
                  className="rounded-full bg-rose-50 px-4 py-2 text-xs font-medium text-rose-600 transition hover:bg-rose-100"
                >
                  Detail
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal jika item terpilih */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
          onClick={closeDetail}
        >
          <div
            className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeDetail}
              className="absolute right-4 top-4 rounded-full p-1 text-stone-400 hover:bg-stone-100"
            >
              ✕
            </button>
            <h3 className="text-lg font-bold text-stone-900">Detail Confess</h3>
            <div className="mt-4 space-y-2 text-sm text-stone-600">
              <p><strong>Dari:</strong> {selected.from === 'Anonim' ? 'A****m' : selected.from}</p>
              <p><strong>Untuk:</strong> {selected.to}</p>
              <p><strong>Kategori:</strong> {selected.category}</p>
              <p className="mt-2 whitespace-pre-wrap rounded-lg bg-stone-50 p-3 text-stone-800">
                {selected.message}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}