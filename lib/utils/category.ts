export interface Category {
  id: string;
  emoji: string;
  label: string;
}

export const CATEGORIES: readonly Category[] = [
  { id: 'love', emoji: '❤️', label: 'Love' },
  { id: 'crush', emoji: '🥰', label: 'Crush' },
  { id: 'miss', emoji: '🥺', label: 'Miss' },
  { id: 'happy', emoji: '😊', label: 'Happy' },
  { id: 'sad', emoji: '😢', label: 'Sad' },
  { id: 'angry', emoji: '😤', label: 'Angry' },
  { id: 'grateful', emoji: '🙏', label: 'Grateful' },
  { id: 'secret', emoji: '🤫', label: 'Secret' },
  { id: 'confused', emoji: '😵‍💫', label: 'Confused' },
  { id: 'support', emoji: '🤍', label: 'Support' },
] as const;

export type CategoryId = (typeof CATEGORIES)[number]['id'] | (string & {});

const CATEGORY_MAP = new Map<string, Category>(
  CATEGORIES.map((cat) => [cat.id, cat])
);

export const categoryEmoji = (id: string): string =>
  CATEGORY_MAP.get(id.toLowerCase())?.emoji ?? '🤍';

export const categoryLabel = (id: string): string =>
  CATEGORY_MAP.get(id.toLowerCase())?.label ?? 'Support';

const NOTE_BG: Record<string, string> = {
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

export const noteBg = (id: string): string =>
  NOTE_BG[id.toLowerCase()] ?? 'bg-yellow-100';