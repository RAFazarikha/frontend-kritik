'use client';

import { motion } from 'framer-motion';
import StickyNote from './StickyNote';
import type { Confess } from '@/types';

export interface BoardProps {
  confesses: Confess[] | null;
  loading: boolean;
  error: string | null;
  retry: () => void;
  onNoteClick: (confess: Confess) => void;
  onEmptyClick: () => void;
  onLove?: (id: string, count: number) => void;
}

const SKELETON_ROTATIONS = [-2, 1.5, -1, 2.5, -1.5, 1, -2.5, 2];

function Skeleton({ rotate }: { rotate: number }) {
  return (
    <div
      style={{ transform: `rotate(${rotate}deg)` }}
      className="mb-5 h-48 animate-pulse break-inside-avoid rounded-2xl bg-white/60 shadow-sm"
      aria-hidden
    />
  );
}

export default function Board({
  confesses,
  loading,
  error,
  retry,
  onNoteClick,
  onEmptyClick,
  onLove,
}: BoardProps) {
  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-5 pb-20">
        <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
          {SKELETON_ROTATIONS.map((r, i) => (
            <Skeleton key={i} rotate={r} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center px-5 pb-20 pt-16 text-center">
        <div className="text-5xl">🥺</div>
        <p className="mt-4 text-lg font-semibold text-rose-950">
          Hmm... papan confess sedang sulit dijangkau 🥺
        </p>
        <p className="mt-1 text-sm text-rose-900/60">
          Coba lagi beberapa saat lagi.
        </p>
        <button
          onClick={retry}
          className="mt-6 rounded-full bg-rose-500 px-6 py-2.5 font-semibold text-white shadow-lg shadow-rose-200 transition hover:bg-rose-600"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  if (!confesses || confesses.length === 0) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center px-5 pb-20 pt-16 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-6xl"
        >
          💌
        </motion.div>
        <p className="mt-4 text-lg font-semibold text-rose-950">
          Belum ada cerita di sini.
        </p>
        <p className="mt-1 text-sm text-rose-900/60">
          Mungkin kamu bisa menjadi orang pertama yang meninggalkan pesan.
        </p>
        <button
          onClick={onEmptyClick}
          className="mt-6 rounded-full bg-rose-500 px-6 py-2.5 font-semibold text-white shadow-lg shadow-rose-200 transition hover:bg-rose-600"
        >
          Tulis Confess
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-5 pb-24">
      <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
        {confesses.map((note) => (
          <StickyNote
            key={note.id}
            note={note}
            onNoteClick={onNoteClick}
            onLove={onLove}
          />
        ))}
      </div>
    </div>
  );
}