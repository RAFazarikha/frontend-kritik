import { useEffect, useState } from 'react';
import { getConfesses } from '../api/confesses';

export default function useConfesses() {
  const [confesses, setConfesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await getConfesses();
      setConfesses(data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const addConfess = (confess) => setConfesses((prev) => [confess, ...prev]);

  const bumpLove = (id, count) =>
    setConfesses((prev) => prev.map((c) => (c.id === id ? { ...c, loveCount: count } : c)));

  return { confesses, loading, error, retry: load, addConfess, bumpLove };
}