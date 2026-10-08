import { useState, useEffect, useCallback } from 'react';
import { getConfesses } from '@/lib/api/confesses';
import type { Confess } from '@/types';

export interface UseConfessesReturn {
  confesses: Confess[];
  loading: boolean;
  error: string;
  refetch: () => Promise<void>;
  addConfess: (newConfess: Confess) => void;
  bumpLove: (id: string, newCount: number) => void;
  updateLocal: (id: string, fn: (prev: Confess) => Confess) => void;
}

export default function useConfesses(): UseConfessesReturn {
  const [confesses, setConfesses] = useState<Confess[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const loadConfesses = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getConfesses();
      const list: Confess[] = Array.isArray(data)
        ? data
        : Array.isArray((data as { data?: Confess[] })?.data)
        ? (data as { data: Confess[] }).data
        : [];
      setConfesses(list);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Gagal memuat confess';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const addConfess = useCallback((newConfess: Confess) => {
    setConfesses((prev) => [newConfess, ...prev]);
  }, []);

  const bumpLove = useCallback((id: string, newCount: number) => {
    setConfesses((prev) =>
      prev.map((c) => (c.id === id ? { ...c, loveCount: newCount } : c))
    );
  }, []);

  useEffect(() => {
    loadConfesses();
  }, [loadConfesses]);

  const updateLocal = (id: string, fn: (prev: Confess) => Confess) => {
    setConfesses((prev) => prev.map((c) => (c.id === id ? fn(c) : c)));
  };

  return {
    confesses,
    loading,
    error,
    refetch: loadConfesses,
    addConfess,
    bumpLove,
    updateLocal,
  };
}