'use client';

import { useState, MouseEvent } from 'react';
import { motion } from 'framer-motion';
import { loveConfess } from '@/lib/api/confesses';

const KEY = 'lovedConfesses';

const getLoved = (): string[] => {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(sessionStorage.getItem(KEY) || '[]') ?? [];
  } catch {
    return [];
  }
};

const isLoved = (id: string): boolean => getLoved().includes(id);

const addLoved = (id: string): void => {
  if (typeof window === 'undefined') return;
  const list = getLoved();
  if (!list.includes(id)) {
    sessionStorage.setItem(KEY, JSON.stringify([...list, id]));
  }
};

export interface LoveButtonProps {
  id: string;
  count: number;
  onLove?: (id: string, count: number) => void;
  big?: boolean;
}

export default function LoveButton({
  id,
  count,
  onLove,
  big,
}: LoveButtonProps) {
  const [busy, setBusy] = useState<boolean>(false);
  const [gentle, setGentle] = useState<boolean>(false);
  const loved = isLoved(id);

  const handle = async (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (busy || loved) return;
    setBusy(true);
    setGentle(false);

    try {
      const { ok, status: s, payload } = await loveConfess(id);

      if (s === 429) {
        setGentle(true);
        return;
      }
      if (!ok) return;

      const newCount = payload?.loveCount;
      if (newCount == null) return;

      addLoved(id);
      if (onLove) onLove(id, newCount);
    } catch {
      /* Silently catch error */
    } finally {
      setBusy(false);
    }
  };

  return (
    <span className="relative inline-flex">
      {gentle && (
        <motion.span
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-full right-0 z-10 mb-2 w-max max-w-56 rounded-full bg-stone-800/90 px-3 py-1.5 text-xs font-medium text-white shadow-lg"
        >
          Pelan-pelan 💗 Coba lagi sebentar.
        </motion.span>
      )}
      <motion.button
        type="button"
        onClick={handle}
        disabled={busy || loved}
        whileTap={loved ? {} : { scale: 0.85 }}
        aria-label={`Love confess ini, sekarang ${count} love`}
        className={`flex items-center gap-1.5 rounded-full font-semibold shadow-sm transition-colors disabled:opacity-70 ${
          big ? 'px-5 py-2.5 text-lg' : 'px-3 py-1.5 text-sm'
        } ${
          loved
            ? 'bg-rose-500 text-white'
            : 'bg-white/80 text-rose-500 hover:bg-rose-100'
        }`}
      >
        <motion.span
          key={String(loved)}
          animate={loved ? { scale: [1, 1.5, 1] } : {}}
          transition={{ duration: 0.35 }}
          aria-hidden
        >
          {loved ? '♥' : '♡'}
        </motion.span>
        <motion.span
          key={count}
          initial={{ scale: 1.35 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.25 }}
        >
          {count}
        </motion.span>
      </motion.button>
    </span>
  );
}