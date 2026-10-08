'use client';

import { useState, useCallback, useEffect } from 'react';
import { AnimatePresence, MotionConfig } from 'framer-motion';
import Header from '@/components/Header';
import Board from '@/components/Board';
import ConfessFormModal from '@/components/ConfessFormModal';
import ConfessDetailModal from '@/components/ConfessDetailModal';
import useConfesses from '@/hooks/useConfesses';
import type { Confess } from '@/types';

export default function HomePage() {
  const { confesses, loading, error, refetch, addConfess, bumpLove } =
    useConfesses();
  const [formOpen, setFormOpen] = useState<boolean>(false);
  const [selected, setSelected] = useState<Confess | null>(null);

  const openForm = () => setFormOpen(true);

  const handleSaved = useCallback(
    (newConfess: Confess) => {
      addConfess(newConfess);
      setFormOpen(false);
    },
    [addConfess]
  );

  const handleLove = (id: string, newCount: number) => {
    bumpLove(id, newCount);
    setSelected((prev) =>
      prev && prev.id === id ? { ...prev, loveCount: newCount } : prev
    );
  };

  const openDetail = (confess: Confess) => setSelected(confess);
  const closeDetail = () => setSelected(null);

  // Scroll lock saat modal terbuka
  useEffect(() => {
    const anyOpen = formOpen || Boolean(selected);
    document.body.style.overflow = anyOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [formOpen, selected]);

  // Handle shortcut Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (selected) setSelected(null);
      else if (formOpen) setFormOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [formOpen, selected]);

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-linear-to-br from-rose-50 via-amber-50 to-sky-50 font-sans selection:bg-rose-200">
        <Header onWrite={openForm} />
        <main>
          <Board
            confesses={confesses}
            loading={loading}
            error={error}
            retry={refetch}
            onNoteClick={openDetail}
            onEmptyClick={openForm}
            onLove={handleLove}
          />
        </main>

        <ConfessFormModal
          isOpen={formOpen}
          onClose={() => setFormOpen(false)}
          onSaved={handleSaved}
        />

        <AnimatePresence>
          {selected && (
            <ConfessDetailModal
              confess={selected}
              onClose={closeDetail}
              onLove={handleLove}
            />
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
}