import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-rose-50 via-amber-50 to-sky-50">
      <div className="p-10 text-center">
        <h1 className="mb-4 text-6xl font-bold text-rose-500">404</h1>
        <p className="mb-6 text-xl text-gray-600">Halaman tidak ditemukan</p>
        <Link
          href="/"
          className="inline-block rounded-lg bg-rose-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-300"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}