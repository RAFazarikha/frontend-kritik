'use client';

import { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { createConfess } from '@/lib/api/confesses';
import useAudio from '@/hooks/useAudio';
import CategoryPicker from './CategoryPicker';
import type { Confess } from '@/types';

const MAX_CHARS = 500;

export interface ConfessFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: (newConfess: Confess) => void;
}

export default function ConfessFormModal({
  isOpen,
  onClose,
  onSaved,
}: ConfessFormModalProps) {
  const [from, setFrom] = useState<string>('Anonim');
  const [to, setTo] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useAudio(isOpen);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!from.trim() || !to.trim() || !message.trim() || !category) {
      setError('Semua field wajib diisi.');
      return;
    }
    if (message.length > MAX_CHARS) {
      setError(`Pesan maksimal ${MAX_CHARS} karakter.`);
      return;
    }

    setSubmitting(true);
    try {
      const body = {
        from: from || 'Anonymous',
        to,
        message,
        category,
        screenRes: typeof window !== 'undefined' ? `${window.screen.width}x${window.screen.height}` : 'desktop',
        deviceType: typeof window !== 'undefined' && window.innerWidth < 768 ? 'mobile' : 'desktop',
      };

      const { ok, payload: created } = await createConfess(body);
      if (!ok || !created) {
        setError('Gagal kirim. Coba lagi.');
        return;
      }

      onSaved(created);
      setFrom('');
      setTo('');
      setMessage('');
      setCategory('');
      onClose();
    } catch {
      setError('Gagal kirim. Coba lagi.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm sm:p-6"
      onClick={onClose}
    >
      <motion.form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="max-h-full w-full max-w-md overflow-y-auto rounded-2xl border border-rose-100 bg-white p-6 shadow-2xl scrollbar-none [&::-webkit-scrollbar]:hidden"
      >
        <h2 className="text-xl font-bold text-rose-950">
          ✍️ Titip Confess Anonim
        </h2>
        <h4 className="mb-4 text-sm font-light text-rose-950">
          Curhatin aja yang bikin kepikiran, tumpahin secara anonim di sini. Jangan lupa set kategorinya & turn up the volume biar makin dapet feel-nya! 🎧✨
        </h4>

        {error && <p className="mb-3 text-sm text-rose-500">{error}</p>}

        <div className="space-y-4">
          <div>
            <label
              htmlFor="from"
              className="mb-1 block text-sm font-medium text-stone-600"
            >
              Dari
            </label>
            <input
              id="from"
              type="text"
              value="Anonim"
              disabled
              className="w-full rounded-lg border border-stone-200 bg-stone-100 px-3 py-2 text-base text-stone-500 focus:border-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-100 cursor-not-allowed"
            />
          </div>

          <div>
            <label
              htmlFor="to"
              className="mb-1 block text-sm font-medium text-stone-600"
            >
              Untuk siapa?
            </label>
            <input
              id="to"
              type="text"
              placeholder="Misal: Teman, Kamu, Semua..."
              value={to}
              onChange={(e) => setTo(e.target.value)}
              maxLength={MAX_CHARS}
              className="w-full rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-base text-stone-800 placeholder:text-stone-400 focus:border-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-100"
              required
            />
            <p className="mt-0.5 text-right text-xs text-stone-400">
              {to.length}/{MAX_CHARS}
            </p>
          </div>

          <div>
            <label
              htmlFor="message"
              className="mb-1 block text-sm font-medium text-stone-600"
            >
              Pesanmu
            </label>
            <textarea
              id="message"
              placeholder="Tulis apa yang selama ini ingin kamu katakan... 💭"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              maxLength={MAX_CHARS}
              className="w-full resize-y rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-base text-stone-800 placeholder:text-stone-400 focus:border-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-100"
              required
            />
            <p className="mt-0.5 text-right text-xs text-stone-400">
              {message.length}/{MAX_CHARS}
            </p>
          </div>

          <CategoryPicker
            value={category}
            onChange={setCategory}
            error={error}
          />
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-4 py-2 text-sm font-medium text-stone-600 transition hover:bg-stone-100"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="relative inline-flex items-center justify-center rounded-full bg-rose-500 px-5 py-2.5 font-semibold text-white shadow-lg shadow-rose-200 transition hover:bg-rose-600 disabled:opacity-60"
          >
            {submitting ? 'Mengirim...' : 'Titip Cerita 💌'}
          </button>
        </div>
      </motion.form>
    </div>
  );
}