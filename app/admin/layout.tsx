'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { useAdminAuth } from '@/hooks/useAdminAuth';

export interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { logout } = useAdminAuth();

  return (
    <div className="flex min-h-screen bg-linear-to-br from-rose-50 via-amber-50 to-sky-50 font-sans selection:bg-rose-200">
      <aside
        className="hidden w-64 border-r border-gray-200 bg-white md:flex md:flex-col"
        aria-label="Admin navigation"
      >
        <div className="border-b border-gray-200 p-6">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">💌</span>
            <span className="text-xl font-bold text-rose-500">Admin Panel</span>
          </div>
        </div>

        <nav className="flex-1 p-4">
          <div className="mb-2 text-sm font-semibold uppercase tracking-wider text-gray-500">
            Menu
          </div>
          <ul className="space-y-1">
            <li>
              <Link
                href="/admin"
                className="flex items-center rounded-lg px-4 py-2 text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900"
              >
                <span className="mr-3 text-xl">📊</span>
                <span>Dashboard</span>
              </Link>
            </li>
            <li>
              <Link
                href="/admin/confesses"
                className="flex items-center rounded-lg px-4 py-2 text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900"
              >
                <span className="mr-3 text-xl">💌</span>
                <span>Confesses</span>
              </Link>
            </li>
          </ul>
        </nav>

        <div className="border-t border-gray-200 p-4">
          <button
            onClick={logout}
            className="flex w-full items-center rounded-lg px-4 py-2 text-gray-700 transition-colors hover:bg-red-50 hover:text-red-600"
            aria-label="Logout"
          >
            <span className="mr-3 text-xl">🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="border-b border-gray-200 bg-white px-6 py-4 md:hidden">
          <div className="flex items-center justify-between">
            <button
              className="rounded-lg bg-gray-100 p-2 text-gray-700 transition-colors hover:bg-gray-200"
              aria-label="Open menu"
            >
              ☰
            </button>
            <div className="flex items-center space-x-2">
              <span className="text-xl">💌</span>
              <span className="text-lg font-bold text-rose-500">
                Admin Panel
              </span>
            </div>
            <div className="w-8"></div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}