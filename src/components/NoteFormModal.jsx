import { useEffect, useRef, useState } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000/api';
const COLORS = ['pastel-yellow', 'pastel-pink', 'pastel-blue', 'pastel-green'];
const STICKERS = ['bulb', 'fire', 'heart', 'star'];

export default function NoteFormModal({ isOpen, onClose, onSaved }) {
  const audioRef = useRef(null);
  const [content, setContent] = useState('');
  const [color, setColor] = useState('pastel-yellow');
  const [sticker, setSticker] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Audio diambil dari /frontend-kritik/public/audio/form-bgm.mp3
      audioRef.current = new Audio('/audio/form-bgm.mp3');
      audioRef.current.loop = true;
      audioRef.current.volume = 0.25;
      audioRef.current.play().catch(() => console.log('Menunggu interaksi user...'));
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    }
    return () => audioRef.current?.pause();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!content.trim()) {
      setError('Isi dulu catatannya.');
      return;
    }
    if (content.length > 280) {
      setError('Maksimal 280 karakter.');
      return;
    }

    setSaving(true);
    try {
      const res = await axios.post(`${API}/notes`, {
        content,
        color,
        sticker: sticker || null,
        screenRes: `${window.screen.width}x${window.screen.height}`,
      });
      onSaved(res.data);
      setContent('');
      setSticker('');
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Gagal kirim. Coba lagi.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4"
      >
        <h2 className="text-xl font-bold text-gray-800">✍️ Tulis Catatan</h2>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Kritik, saran, atau ide... (anonim)"
          rows={4}
          maxLength={280}
          className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-amber-400 focus:outline-none"
        />
        <p className="text-xs text-gray-500 text-right">{content.length}/280</p>

        <div className="flex gap-2">
          {COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              className={`w-8 h-8 rounded-full border-2 transition ${
                color === c ? 'border-amber-500 scale-110' : 'border-transparent'
              } ${
                c === 'pastel-yellow' ? 'bg-yellow-200' :
                c === 'pastel-pink' ? 'bg-pink-200' :
                c === 'pastel-blue' ? 'bg-blue-200' : 'bg-green-200'
              }`}
            />
          ))}
        </div>

        <div className="flex gap-2">
          {STICKERS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSticker(sticker === s ? '' : s)}
              className={`w-9 h-9 text-lg rounded-lg border transition ${
                sticker === s ? 'border-amber-500 bg-amber-50 scale-110' : 'border-gray-200'
              }`}
            >
              {s === 'bulb' ? '💡' : s === 'fire' ? '🔥' : s === 'heart' ? '❤️' : '⭐'}
            </button>
          ))}
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="flex gap-2 justify-end">
          <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            Batal
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white rounded-lg font-semibold"
          >
            {saving ? 'Mengirim...' : 'Kirim'}
          </button>
        </div>
      </form>
    </div>
  );
}