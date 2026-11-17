/**
 * Bottom navigation of the student app.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Icon, Text } from '@/components/ui';
import { colors, radius, shadows, spacing, TOUCH_TARGET } from '@/theme/tokens';
import type { IconName } from '@/types/ui';

// Label and icon of each tab, by route name.
const TABS: Record<string, { label: string; icon: IconName }> = {
  Courses: { label: 'Cursos', icon: 'menu_book' },
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
  return (
    <View accessibilityRole="tablist" style={styles.bar}>
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
            <View style={[styles.holder, isActive && styles.active]}><Icon name={tab.icon} size="xl" color={tint} /></View>
            <Text variant={isActive ? 'bodyMBold' : 'bodyM'} style={{ color: tint }}>
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { position: 'absolute', bottom: 16, left: 16, right: 16, height: 68, borderRadius: radius.xxl, borderWidth: 1, borderColor: colors.surfaceBorder, flexDirection: 'row', paddingHorizontal: 12, backgroundColor: colors.white, ...shadows.nav },
  holder: { width: 52, height: 30, borderRadius: radius.full, alignItems: 'center', justifyContent: 'center' },
  active: { backgroundColor: colors.primaryContainerSoft },
  tab: { flex: 1, minHeight: TOUCH_TARGET, alignItems: 'center', justifyContent: 'center', gap: spacing.xxs },
});
