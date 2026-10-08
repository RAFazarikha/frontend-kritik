import { useEffect } from 'react';

export default function useAudio(open: boolean): void {
  useEffect(() => {
    if (!open) return;

    const audio = new Audio('/audio/form-bgm.mp3');
    audio.loop = true;
    audio.volume = 0.25;

    audio.play().catch(() => {
      // Autoplay terblokir oleh kebijakan peramban
    });

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, [open]);
}