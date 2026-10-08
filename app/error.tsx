'use client';

import { useEffect } from 'react';

export interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-rose-50 via-amber-50 to-sky-50">
      <div className="p-10 text-center">
        <h1 className="mb-4 text-4xl font-bold text-rose-500">Ada yang salah</h1>
        <p className="mb-6 text-gray-600">
          Terjadi kesalahan saat memuat halaman ini.
        </p>
        <button
          onClick={reset}
          className="rounded-lg bg-rose-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-300"
        >
          Coba lagi
        </button>
      </div>
    </div>
  );
}