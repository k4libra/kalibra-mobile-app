import React, { useContext } from 'react';
import { Image, Pressable, StyleSheet, View, type ImageSourcePropType } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CountBadge, IconButton, Text } from '@/components/ui';
import { AuthContext } from '@/context/AuthContext';
import { colors, radius, shadows } from '@/theme/tokens';
import { initials } from '@/utils/identity';
import { BrandMark } from './BrandMark';
export interface AppHeaderProps {
  title?: string; onBack?: () => void; onNotifications?: () => void;
  onProfile?: () => void; avatar?: ImageSourcePropType; greeting?: string;
  subtitle?: string; notificationCount?: number;
}
/** Home, back and brand variants share the same 64-point top bar. */
export function AppHeader({ title, onBack, onNotifications, onProfile, avatar, greeting, subtitle, notificationCount = 0 }: AppHeaderProps) {
  const insets = useSafeAreaInsets();
  const session = useContext(AuthContext)?.session;
  const profile = (size: number) => <Pressable accessibilityRole="button" accessibilityLabel="Mi perfil" onPress={onProfile}
    style={[styles.avatar, { width: size, height: size }]}>
    {avatar ? <Image source={avatar} style={styles.photo} /> : <Text variant="bodyMBold" color="brand">{initials(session?.user.fullName ?? '')}</Text>}
  </Pressable>;
  return <View style={[styles.header, { paddingTop: insets.top }]}><View style={styles.row}>
    {greeting ? <><View style={styles.home}>{profile(44)}<View style={styles.copy}><Text variant="headlineM">{greeting}</Text><Text variant="bodyM" color="secondary">{subtitle}</Text></View></View>
      <View><IconButton name="notifications" label="Notificaciones" onPress={onNotifications} />{notificationCount > 0 && <View style={styles.badge}><CountBadge count={notificationCount} /></View>}</View></>
      : title ? <><IconButton name="arrow_back" label="Volver" onPress={onBack} /><Text variant="title" isHeading style={styles.title}>{title}</Text>{profile(40)}</>
        : <><View style={styles.brand}><BrandMark /><Text variant="brand">Kalibra</Text></View>{profile(40)}</>}
  </View></View>;
}
const styles = StyleSheet.create({ header: { backgroundColor: 'transparent' }, row: { height: 64, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  home: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12 }, copy: { flex: 1, gap: 2 }, brand: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  title: { flex: 1, textAlign: 'center' }, avatar: { borderRadius: radius.full, borderWidth: 2, borderColor: colors.white, backgroundColor: colors.primaryContainerSoft, alignItems: 'center', justifyContent: 'center', ...shadows.card },
  photo: { width: '100%', height: '100%', borderRadius: radius.full }, badge: { position: 'absolute', top: -4, right: -4 } });
