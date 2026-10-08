'use client';

import { KeyboardEvent, MouseEvent } from 'react';
import { motion } from 'framer-motion';
import LoveButton from './LoveButton';
import { categoryEmoji, noteBg } from '@/lib/utils/category';
import type { Confess } from '@/types';

export interface StickyNoteProps {
  note: Confess;
  onNoteClick: (note: Confess) => void;
  onLove?: (id: string, count: number) => void;
}

export default function StickyNote({
  note,
  onNoteClick,
  onLove,
}: StickyNoteProps) {
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onNoteClick(note);
    }
  };

  return (
    <motion.div
      role="button"
      tabIndex={0}
      aria-label={`Buka confess dari ${note.from} untuk ${note.to}`}
      onClick={() => onNoteClick(note)}
      onKeyDown={handleKeyDown}
      style={{ transform: `rotate(${note.rotation ?? 0}deg)` }}
      whileHover={{ scale: 1.04, rotate: 0, y: -6 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`mb-5 break-inside-avoid cursor-pointer rounded-2xl p-5 shadow-md outline-none transition-shadow hover:shadow-xl focus-visible:ring-2 focus-visible:ring-rose-400 ${noteBg(
        note.category
      )}`}
    >
      <div className="text-3xl" aria-hidden>
        {categoryEmoji(note.category)}
      </div>
      <p className="mt-2 text-[11px] font-bold uppercase tracking-wider text-stone-500">
        From:{' '}
        <span className="font-semibold normal-case tracking-normal text-stone-700">
          {note.from}
        </span>
      </p>
      <p className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
        To:{' '}
        <span className="font-semibold normal-case tracking-normal text-stone-700">
          {note.to}
        </span>
      </p>
      <p className="mt-3 line-clamp-4 whitespace-pre-wrap wrap-break-word text-sm leading-relaxed text-stone-700">
        “{note.message}”
      </p>
      <div
        className="mt-3 flex justify-end"
        onClick={(e: MouseEvent<HTMLDivElement>) => e.stopPropagation()}
      >
        <LoveButton
          id={note.id}
          count={note.loveCount ?? 0}
          onLove={onLove}
        />
      </div>
    </motion.div>
  );
}