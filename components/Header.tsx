'use client';

export interface HeaderProps {
  onWrite: () => void;
}

export default function Header({ onWrite }: HeaderProps) {
  return (
    <header className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-6 md:py-8">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-rose-950 md:text-3xl">
          💌 Confess
        </h1>
        <p className="mt-0.5 text-sm text-rose-900/50">
          papan cerita anonim — titipkan rasa yang belum terkatakan
        </p>
      </div>
      <button
        onClick={onWrite}
        className="shrink-0 rounded-full bg-rose-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-rose-200 transition hover:-translate-y-0.5 hover:bg-rose-600 active:translate-y-0 md:text-base"
      >
        + Tulis Confess
      </button>
    </header>
  );
}