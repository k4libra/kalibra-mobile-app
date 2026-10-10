/**
 * Filter tabs of the practice history.
 *
 * @author MRamirez202210582
 * @packageDocumentation
 */

import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Text, type TextColor } from '@/components/ui';
import { colors, radius, spacing, TOUCH_TARGET } from '@/theme/tokens';
import type { HistoryFilter, HistorySummary } from '@/types/progress';

// Label and count color of each filter.
const TABS: Record<HistoryFilter, { label: string; countBackground: string; countColor: TextColor }> = {
  all: { label: 'Todos', countBackground: colors.primaryPale, countColor: 'brand' },
  correct: { label: 'Correctos', countBackground: colors.secondaryContainer, countColor: 'success' },
  review: { label: 'Para repasar', countBackground: colors.dangerContainer, countColor: 'danger' },
};

// Total of each filter.
const COUNT: Record<HistoryFilter, (summary: HistorySummary) => number> = {
  all: summary => summary.total,
  correct: summary => summary.correct,
  review: summary => summary.incorrect,
};

/**
 * Props accepted by {@link HistoryFilterTabs}.
 */
export interface HistoryFilterTabsProps {
  /** Totals shown in each tab. */
  summary: HistorySummary;
  /** Active filter. */
  value: HistoryFilter;
  /** Called with the filter the student picks. */
  onChange: (filter: HistoryFilter) => void;
}

/**
 * Renders the three history filters with their totals.
 */
export function HistoryFilterTabs({ summary, value, onChange }: HistoryFilterTabsProps) {
  return (
    <View accessibilityRole="tablist" style={styles.row}>
      {(Object.keys(TABS) as HistoryFilter[]).map(filter => {
        const tab = TABS[filter];
        const isActive = filter === value;
        return (
          <Pressable
            key={filter}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={`${tab.label}, ${COUNT[filter](summary)}`}
            onPress={() => onChange(filter)}
            style={[styles.tab, isActive && styles.active]}
          >
            <Text variant="labelL" color={isActive ? 'onPrimary' : 'primary'}>
              {tab.label}
            </Text>
            <View style={[styles.count, { backgroundColor: isActive ? colors.primary : tab.countBackground }]}>
              <Text variant="labelS" color={isActive ? 'onPrimary' : tab.countColor}>
                {COUNT[filter](summary)}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.md },
  tab: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, minHeight: TOUCH_TARGET, paddingHorizontal: spacing.lg, borderRadius: radius.md, backgroundColor: colors.primaryContainer },
  active: { backgroundColor: colors.primaryStrong },
  count: { minWidth: 22, paddingHorizontal: spacing.sm, paddingVertical: spacing.xxs, borderRadius: radius.full, alignItems: 'center' },
});
