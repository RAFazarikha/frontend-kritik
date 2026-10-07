import { useState } from 'react';
import { motion } from 'framer-motion';
import { loveConfess } from '../api/confesses';

// ponytail: sessionStorage bukan security, hanya UX — backend rate limit tetap pelindung spam
const KEY = 'lovedConfesses';
const getLoved = () => {
  try {
    return JSON.parse(sessionStorage.getItem(KEY)) ?? [];
  } catch {
    return [];
  }
};
const isLoved = (id) => getLoved().includes(id);
const addLoved = (id) => {
  const list = getLoved();
  if (!list.includes(id)) sessionStorage.setItem(KEY, JSON.stringify([...list, id]));
};

// Backend = source of truth loveCount; frontend hanya menampilkan balikan API.
// loved derived dari sessionStorage (bukan state lokal) supaya instance modal & board selalu sinkron.
export default function LoveButton({ id, count, onLove, big }) {
  const [busy, setBusy] = useState(false);
  const [gentle, setGentle] = useState(false);
  const loved = isLoved(id);

  const handle = async (e) => {
    e.stopPropagation();
    if (busy || loved) return; // double-click guard + sudah loved
    setBusy(true);
    setGentle(false);
    try {
      const { ok, status: s, data, payload } = await loveConfess(id);
      if (s === 429) {
        setGentle(true);
        return; // jangan tambah count, jangan simpan ID
      }
      if (!ok) return;
      const newCount = payload?.loveCount ?? data?.loveCount;
      if (newCount == null) return; // API error/count tidak ada: count tidak berubah
      addLoved(id);
      onLove(id, newCount); // count dari backend, bukan prev+1
    } catch {
      /* diam: biar tidak spam error UI, user bisa coba lagi */
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
        } ${loved ? 'bg-rose-500 text-white' : 'bg-white/80 text-rose-500 hover:bg-rose-100'}`}
      >
        <motion.span
          key={String(loved)}
          animate={loved ? { scale: [1, 1.5, 1] } : {}}
          transition={{ duration: 0.35 }}
          aria-hidden
        >
          {loved ? '♥' : '♡'}
        </motion.span>
        <motion.span key={count} initial={{ scale: 1.35 }} animate={{ scale: 1 }} transition={{ duration: 0.25 }}>
          {count}
        </motion.span>
      </motion.button>
    </span>
  );
}
