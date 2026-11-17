/**
 * Native reduced-motion preference subscription.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';

/** Reads and observes the native motion preference; null keeps motion off until known. */
export function useReducedMotion(): boolean | null {
  const [reduced, setReduced] = useState<boolean | null>(null);
  useEffect(() => {
    let current = true;
    let changed = false;
    const listener = AccessibilityInfo.addEventListener('reduceMotionChanged', value => {
      changed = true;
      if (current) setReduced(value);
    });
    AccessibilityInfo.isReduceMotionEnabled().then(value => {
      if (current && !changed) setReduced(value);
    }).catch(() => { if (current && !changed) setReduced(true); });
    return () => { current = false; listener.remove(); };
  }, []);
  return reduced;
}
