/**
 * Shares hook-owned session progress across exercise and result screens.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import React, { createContext, useContext, type ReactNode } from 'react';
import { usePracticeSessionState, type PracticeSessionState } from '@/hooks/usePracticeSession';

const PracticeContext = createContext<PracticeSessionState | null>(null);

/** Props accepted by {@link PracticeProvider}. */
export interface PracticeProviderProps {
  /** Navigation subtree sharing the active practice visit. */
  children: ReactNode;
}

/** Provides the current five-exercise visit to the navigation tree. */
export function PracticeProvider({ children }: PracticeProviderProps) {
  const state = usePracticeSessionState();
  return <PracticeContext.Provider value={state}>{children}</PracticeContext.Provider>;
}

/**
 * Reads the shared practice session and its actions.
 *
 * @returns The current visit and hook-owned actions.
 * @throws Error when used outside {@link PracticeProvider}.
 */
export function usePracticeSession(): PracticeSessionState {
  const state = useContext(PracticeContext);
  if (!state) throw new Error('usePracticeSession requires PracticeProvider.');
  return state;
}
