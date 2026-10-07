const COLORS = {
  'pastel-yellow': 'bg-yellow-100',
  'pastel-pink': 'bg-pink-100',
  'pastel-blue': 'bg-blue-100',
  'pastel-green': 'bg-green-100',
};

const STICKERS = { bulb: '💡', fire: '🔥', heart: '❤️', star: '⭐' };

export default function StickyNote({ note }) {
  return (
    <div
      style={{ transform: `rotate(${note.rotation}deg)` }}
      className={`${COLORS[note.color] || 'bg-yellow-100'} p-4 rounded-lg shadow-md min-h-[160px] hover:rotate-0 hover:scale-105 transition-transform`}
    >
      {note.sticker && <span className="text-2xl">{STICKERS[note.sticker]}</span>}
      <p className="text-gray-800 break-words mt-1">{note.content}</p>
      <p className="text-xs text-gray-500 mt-2 text-right">
        {new Date(note.createdAt).toLocaleDateString('id-ID')}
      </p>
    </div>
  );
}