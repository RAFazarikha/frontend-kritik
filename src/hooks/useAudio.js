import { useEffect } from 'react';

// Audio BGM hanya hidup selama modal form terbuka; unmount = pause + buang instance.
export default function useAudio(open) {
  useEffect(() => {
    if (!open) return undefined;
    const audio = new Audio('/audio/form-bgm.mp3');
    audio.loop = true;
    audio.volume = 0.25;
    audio.play().catch(() => {}); // autoplay ditolak browser: diam saja, tanpa error UI
    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, [open]);
}