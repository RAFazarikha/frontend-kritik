import { useEffect, useState } from 'react';

export default function Toast({ message, type = 'success', onClose }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onClose?.(), 300);
    }, 3000);
    return () => clearTimeout(t);
  }, [onClose]);

  if (!visible) return null;

  return (
    <div
      className={`toast ${type}`}
      role="alert"
      aria-live="polite"
    >
      <span>{type === 'success' ? '✓' : '✕'}</span>
      <span>{message}</span>
    </div>
  );
}