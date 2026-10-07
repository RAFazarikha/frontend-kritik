import { motion } from 'framer-motion';
import LoveButton from './LoveButton';
import { categoryEmoji, categoryLabel } from '../utils/category';

export default function ConfessDetailModal({ confess, onClose, onLove }) {
  return (
    <>
      <motion.div
        className="fixed inset-0 z-40 bg-rose-950/50 backdrop-blur-md"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={`Confess untuk ${confess.to}`}
        initial={{ opacity: 0, scale: 0.9, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 24 }}
        transition={{ type: 'spring', damping: 26, stiffness: 300 }}
        className="fixed inset-x-4 inset-y-10 z-50 flex items-center justify-center md:inset-0"
        onClick={onClose}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative max-h-full w-full max-w-md overflow-y-auto rounded-3xl border border-rose-100 bg-gradient-to-br from-amber-50 via-white to-rose-50 p-8 shadow-2xl"
        >
          <button
            onClick={onClose}
            aria-label="Tutup detail confess"
            className="absolute right-5 top-5 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-rose-400 shadow-sm transition hover:bg-white hover:text-rose-600"
          >
            ✕
          </button>

          <div className="flex flex-col items-center text-center">
            <motion.div
              initial={{ scale: 0.5, rotate: -12 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', damping: 12, delay: 0.1 }}
              className="flex h-24 w-24 items-center justify-center rounded-full bg-white text-6xl shadow-lg ring-4 ring-rose-100"
              aria-hidden
            >
              {categoryEmoji(confess.category)}
            </motion.div>

            <p className="mt-5 text-sm text-stone-500">
              Dari <span className="font-semibold text-stone-700">{confess.from}</span>
            </p>
            <p className="mt-0.5 text-sm text-stone-500">
              Untuk <span className="font-semibold text-stone-700">{confess.to}</span>
              <span className="mx-1 text-stone-300">·</span>
              <span className="text-stone-400">{categoryLabel(confess.category)}</span>
            </p>

            <p className="mt-5 whitespace-pre-wrap break-words text-lg leading-relaxed text-stone-800">
              “{confess.message}”
            </p>

            <div className="mt-7">
              <LoveButton id={confess.id} count={confess.loveCount ?? 0} onLove={onLove} big />
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}