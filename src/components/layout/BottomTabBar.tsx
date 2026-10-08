/**
 * Bottom navigation of the student app.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon, Text } from '@/components/ui';
import { colors, shadows, spacing, TOUCH_TARGET } from '@/theme/tokens';
import type { IconName } from '@/types/ui';

// Label and icon of each tab, by route name.
const TABS: Record<string, { label: string; icon: IconName }> = {
  Courses: { label: 'Cursos', icon: 'school' },
  Progress: { label: 'Progreso', icon: 'trending_up' },
  History: { label: 'Historial', icon: 'history' },
  Profile: { label: 'Perfil', icon: 'person' },
};

/**
 * Renders the four tabs of the app with the active one highlighted.
 *
 * @remarks
 * Pass it as the `tabBar` of the bottom tab navigator.
 *
 * @example
 * ```tsx
 * <Tab.Navigator tabBar={(props) => <BottomTabBar {...props} />} />
 * ```
 */
export function BottomTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  return (
    <View accessibilityRole="tablist" style={[styles.bar, { paddingBottom: Math.max(insets.bottom, spacing.md) }]}>
      {state.routes.map((route, index) => {
        const tab = TABS[route.name];
        const isActive = state.index === index;
        const tint = isActive ? colors.primary : colors.contentSecondary;
        return (
          <Pressable
            key={route.key}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={tab.label}
            onPress={() => {
              const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
              if (!isActive && !event.defaultPrevented) navigation.navigate(route.name);
            }}
            style={styles.tab}
          >
            <Icon name={tab.icon} size="xl" color={tint} />
            <Text variant="labelS" style={{ color: tint }}>
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { flexDirection: 'row', paddingTop: spacing.md, paddingHorizontal: spacing.md, backgroundColor: colors.surfaceBackground, ...shadows.nav },
  tab: { flex: 1, minHeight: TOUCH_TARGET, alignItems: 'center', justifyContent: 'center', gap: spacing.xxs },
});
