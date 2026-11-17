import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';
/** Active viewing time only; generation, background time and pauses are excluded. */
export function useExerciseTimer(exerciseId?: string) {
  const [isPaused, setPaused] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const accumulated = useRef(0);
  const started = useRef<number | null>(null);
  const [isActive, setActive] = useState(AppState.currentState === 'active');
  useEffect(() => {
    const listener = AppState.addEventListener('change', state => setActive(state === 'active'));
    return () => listener.remove();
  }, []);
  useEffect(() => {
    accumulated.current = 0; started.current = null; setSeconds(0); setPaused(false);
  }, [exerciseId]);
  useEffect(() => {
    if (!exerciseId || isPaused || !isActive) return undefined;
    started.current = Date.now();
    const tick = () => setSeconds(Math.floor((accumulated.current + Date.now() - (started.current ?? Date.now())) / 1000));
    const interval = setInterval(tick, 1000);
    return () => {
      clearInterval(interval);
      accumulated.current += Date.now() - (started.current ?? Date.now());
      started.current = null;
    };
  }, [exerciseId, isPaused, isActive]);
  // Snapshot between ticks; cap persisted time at the API maximum of one hour.
  const getTimeSpentSeconds = useCallback(() => Math.max(0, Math.min(3600, Math.floor((accumulated.current
    + (started.current === null ? 0 : Date.now() - started.current)) / 1000))), []);
  const togglePause = useCallback(() => setPaused(value => !value), []);
  const elapsed = `${Math.floor(seconds / 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;
  return { elapsed, isPaused, togglePause, getTimeSpentSeconds };
}
