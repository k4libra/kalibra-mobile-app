/**
 * Hook of the history tab.
 *
 * @author MRamirez202210582
 * @packageDocumentation
 */

import { useState } from 'react';
import { progressService } from '@/services/progress.service';
import type { HistoryEntry, HistoryFilter } from '@/types/progress';
import { useResource } from './useResource';

// Entries shown by each filter.
const FILTERS: Record<HistoryFilter, (entry: HistoryEntry) => boolean> = {
  all: () => true,
  correct: entry => entry.result === 'correct',
  review: entry => entry.result === 'incorrect',
};

/**
 * Loads the practice history and filters it by outcome.
 *
 * @returns The `history` (`null` while loading), the `filter` with `setFilter`, the `entries` of the
 * active filter, and the `isLoading` and `error` state.
 *
 * @example
 * ```tsx
 * const { entries, filter, setFilter } = usePracticeHistory();
 * ```
 */
export function usePracticeHistory() {
  const { data, isLoading, error } = useResource(progressService.getHistory, 'practice-history');
  const [filter, setFilter] = useState<HistoryFilter>('all');
  return {
    history: data,
    filter,
    setFilter,
    entries: (data?.entries ?? []).filter(FILTERS[filter]),
    isLoading,
    error,
  };
}
