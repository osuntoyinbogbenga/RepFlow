import { useState, useEffect, useRef, useCallback } from 'react';
import { useStore } from '../store';

export function useWorkoutTimer(active: boolean) {
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isPaused = useStore(s => s.activeSession.isPaused);

  const pause = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (active && !isPaused) {
      intervalRef.current = setInterval(() => setSeconds(s => s + 1), 1000);
    } else {
      pause();
    }
    return () => pause();
  }, [active, isPaused, pause]);

  const format = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  return { seconds, formatted: format(seconds) };
}

export function useRestTimer(initialSeconds: number, onComplete: () => void) {
  const [remaining, setRemaining] = useState(initialSeconds);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    setRemaining(initialSeconds);
    if (initialSeconds <= 0) return;
    intervalRef.current = setInterval(() => {
      setRemaining(r => {
        if (r <= 1) {
          clearInterval(intervalRef.current!);
          onCompleteRef.current();
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [initialSeconds]);

  const skip = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    onCompleteRef.current();
  }, []);

  const progress = initialSeconds > 0 ? remaining / initialSeconds : 0;
  const format = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  return { remaining, formatted: format(remaining), progress, skip };
}