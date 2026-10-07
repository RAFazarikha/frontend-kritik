import { useState, useCallback, useEffect } from 'react';
import { AnimatePresence, MotionConfig } from 'framer-motion';
import Header from './components/Header';
import Board from './components/Board';
import ConfessFormModal from './components/ConfessFormModal';
import ConfessDetailModal from './components/ConfessDetailModal';
import useConfesses from './hooks/useConfesses';

const CATEGORIES = [
  { id: 'love',     emoji: '❤️',  label: 'Love' },
  { id: 'crush',    emoji: '🥰',  label: 'Crush' },
  { id: 'miss',     emoji: '🥺',  label: 'Miss' },
  { id: 'happy',    emoji: '😊',  label: 'Happy' },
  { id: 'sad',      emoji: '😢',  label: 'Sad' },
  { id: 'angry',    emoji: '😤',  label: 'Angry' },
  { id: 'grateful', emoji: '🙏',  label: 'Grateful' },
  { id: 'secret',   emoji: '🤫',  label: 'Secret' },
  { id: 'confused', emoji: '😵‍💫', label: 'Confused' },
  { id: 'support',  emoji: '🤍',  label: 'Support' },
];

export default function App() {
  const { confesses, loading, error, retry, addConfess, bumpLove } = useConfesses();
  const [formOpen, setFormOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const openForm = () => setFormOpen(true);

  const handleSaved = useCallback(
    (newConfess) => {
      addConfess(newConfess);
      setFormOpen(false);
    },
    [addConfess]
  );

  const handleLove = (id, newCount) => {
    bumpLove(id, newCount); // board
    setSelected((prev) => (prev && prev.id === id ? { ...prev, loveCount: newCount } : prev)); // modal langsung ikut
  };

  const openDetail = (confess) => setSelected(confess);
  const closeDetail = () => setSelected(null);

  // Scroll lock + Escape untuk semua modal
  useEffect(() => {
    const anyOpen = formOpen || selected;
    document.body.style.overflow = anyOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [formOpen, selected]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== 'Escape') return;
      if (selected) setSelected(null);
      else if (formOpen) setFormOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [formOpen, selected]);

  return (
    <MotionConfig reducedMotion="user">
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-amber-50 to-sky-50 font-sans selection:bg-rose-200">
      <Header onWrite={openForm} />
      <main>
        <Board
          confesses={confesses}
          loading={loading}
          error={error}
          retry={retry}
          onNoteClick={openDetail}
          onEmptyClick={openForm}
        />
      </main>

      <ConfessFormModal isOpen={formOpen} onClose={() => setFormOpen(false)} onSaved={handleSaved} />

      <AnimatePresence>
        {selected && (
          <ConfessDetailModal
            confess={selected}
            onClose={closeDetail}
            onLove={(id, count) => handleLove(id, count)}
          />
        )}
      </AnimatePresence>
    </div>
    </MotionConfig>
  );
}