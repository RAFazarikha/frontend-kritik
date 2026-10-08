'use client';

import { motion } from 'framer-motion';
import { CATEGORIES } from '@/lib/utils/category';

export interface CategoryPickerProps {
  value: string;
  onChange: (value: string) => void;
  error?: boolean | string;
}

export default function CategoryPicker({
  value,
  onChange,
  error,
}: CategoryPickerProps) {
  return (
    <div>
      <span className="mb-2 block text-sm font-semibold text-stone-600">
        Kategori perasaan
      </span>
      <div className="grid grid-cols-5 gap-2">
        {CATEGORIES.map((c) => {
          const active = value === c.id;
          return (
            <motion.button
              key={c.id}
              type="button"
              onClick={() => onChange(c.id)}
              whileTap={{ scale: 0.9 }}
              aria-pressed={active}
              aria-label={c.label}
              title={c.label}
              className={`flex flex-col items-center gap-1 rounded-2xl border-2 py-2.5 transition ${
                active
                  ? 'border-rose-400 bg-rose-50 shadow-md'
                  : 'border-transparent bg-stone-50 hover:bg-rose-50'
              } ${error && !value ? 'ring-1 ring-rose-300' : ''}`}
            >
              <motion.span
                className="text-2xl"
                animate={
                  active
                    ? { scale: [1, 1.4, 1.15], y: [0, -4, 0] }
                    : { scale: 1, y: 0 }
                }
                transition={{ duration: 0.35 }}
              >
                {c.emoji}
              </motion.span>
              <span
                className={`text-[10px] font-medium ${
                  active ? 'text-rose-600' : 'text-stone-400'
                }`}
              >
                {c.label}
              </span>
            </motion.button>
          );
        })}
      </div>
      {error && !value && (
        <p className="mt-1.5 text-xs text-rose-500">
          Pilih salah satu kategori ya.
        </p>
      )}
    </div>
  );
}