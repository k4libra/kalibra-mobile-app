/**
 * Exercise calibration hold and reveal lifecycle.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { useEffect, useRef, useState } from 'react';
import { Animated } from 'react-native';
import { useReducedMotion } from './useReducedMotion';

/**
 * Holds the selected level for 550 ms, then reveals the exercise over 250 ms.
 *
 * @param exerciseId - Loaded exercise identity; undefined during generation.
 * @param isLoading - Whether the exercise request is pending.
 * @param hasLevel - Whether the server supplied a known difficulty.
 * @returns Visibility, motion and wait state; `isReady` starts the answer timer after calibration.
 */
export function useExerciseCalibration(exerciseId: string | undefined, isLoading: boolean, hasLevel: boolean) {
  const reduced = useReducedMotion();
  const opacity = useRef(new Animated.Value(0)).current;
  const [presentation, setPresentation] = useState<{ id?: string; phase: 'settling' | 'revealing' | 'shown' }>({ phase: 'settling' });
  const [longWait, setLongWait] = useState(false);
  const phase = presentation.id === exerciseId && !isLoading ? presentation.phase : 'settling';

  useEffect(() => {
    setLongWait(false);
    if (!isLoading) return undefined;
    opacity.setValue(0);
    const timeout = setTimeout(() => setLongWait(true), 6000);
    return () => clearTimeout(timeout);
  }, [isLoading, exerciseId, opacity]);

  useEffect(() => {
    if (!exerciseId || isLoading || reduced === null || phase !== 'settling') return undefined;
    opacity.setValue(0);
    // Even reduced motion renders the selected-level frame before revealing the exercise.
    const timeout = setTimeout(() => {
      if (reduced || !hasLevel) opacity.setValue(1);
      setPresentation({ id: exerciseId, phase: reduced || !hasLevel ? 'shown' : 'revealing' });
    }, reduced || !hasLevel ? 0 : 550);
    return () => clearTimeout(timeout);
  }, [exerciseId, isLoading, hasLevel, reduced, opacity, phase]);

  useEffect(() => {
    if (phase !== 'revealing') return undefined;
    if (reduced !== false) {
      opacity.setValue(1);
      setPresentation({ id: exerciseId, phase: 'shown' });
      return undefined;
    }
    const animation = Animated.timing(opacity, { toValue: 1, duration: 250, useNativeDriver: true });
    animation.start(({ finished }) => {
      if (finished) setPresentation({ id: exerciseId, phase: 'shown' });
    });
    return () => animation.stop();
  }, [exerciseId, opacity, phase, reduced]);

  return {
    isVisible: Boolean(exerciseId) && !isLoading && phase !== 'settling',
    isReady: Boolean(exerciseId) && !isLoading && phase === 'shown',
    showCalibration: isLoading || phase !== 'shown', opacity, isLongWait: longWait,
  };
}
