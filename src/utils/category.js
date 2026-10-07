export const CATEGORIES = [
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

export const categoryEmoji = (id) =>
  CATEGORIES.find((c) => c.id === id)?.emoji ?? '🤍';

export const categoryLabel = (id) =>
  CATEGORIES.find((c) => c.id === id)?.label ?? 'Support';

const NOTE_BG = {
  love: 'bg-rose-100',
  crush: 'bg-pink-100',
  miss: 'bg-violet-100',
  happy: 'bg-yellow-100',
  sad: 'bg-sky-100',
  angry: 'bg-orange-100',
  grateful: 'bg-emerald-100',
  secret: 'bg-stone-100',
  confused: 'bg-lime-100',
  support: 'bg-white',
};

export const noteBg = (id) => NOTE_BG[id] ?? 'bg-yellow-100';