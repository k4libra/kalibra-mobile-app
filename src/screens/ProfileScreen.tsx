/**
 * Profile tab and academic preference controls.
 *
 * @author MRamirez202210582
 * @packageDocumentation
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { PreferenceRow, ProfileSummary } from '@/components/auth';
import { AppHeader, ScreenContainer } from '@/components/layout';
import { Button, Card, ConfirmDialog, ErrorState, LoadingState, Text } from '@/components/ui';
import { useCurrentStudent } from '@/hooks/useCurrentStudent';
import { useProfile } from '@/hooks/useProfile';
import { spacing } from '@/theme/tokens';
/** Shows account details and preferences, using {@link useProfile} for data and actions. */
export function ProfileScreen() {
  const { student } = useCurrentStudent();
  const state = useProfile();
  const profile = state.profile;
  return <>
    <ScreenContainer variant="profile" header={<AppHeader avatar={student?.avatar} />}>
      <View style={styles.heading}><Text variant="headlineL" isHeading>Mi Perfil</Text><Text variant="bodyM" color="secondary">Gestiona tus credenciales académicas, estadísticas y preferencias de aprendizaje.</Text></View>
      {state.error && <ErrorState message={state.error} />}
      {state.isLoading ? <LoadingState /> : profile && <>
        <ProfileSummary user={profile.user} stats={profile.stats} avatar={student?.avatar} />
        <View style={styles.preferences}><Text variant="title" isHeading>Preferencias académicas</Text><Card style={styles.rows}>
          <PreferenceRow title="Modo nocturno" description="Optimizado para sesiones de estudio tarde" icon="dark_mode" value={profile.preferences.darkMode} disabled={state.isSubmitting} onValueChange={state.setDarkMode} />
          <PreferenceRow title="Recordatorios diarios" description={profile.preferences.dailyReminders ? 'Recordatorios activados' : 'Notificaciones desactivadas'} icon="alarm" tone="success" value={profile.preferences.dailyReminders} disabled={state.isSubmitting} onValueChange={state.setDailyReminders} />
        </Card></View>
        <View style={styles.logout}><Button label="Cerrar sesión" icon="logout" iconPosition="start" variant="danger-soft" onPress={state.requestSignOut} /></View>
      </>}
    </ScreenContainer>
    <ConfirmDialog isVisible={state.isSignOutVisible} icon="power_settings_new" tone="danger" title="¿Deseas cerrar sesión en Kalibra?"
      description="Tu progreso de estudio y dominio por subtema están sincronizados en tu cuenta institucional." confirmLabel="Sí, cerrar sesión" confirmIcon="logout" onConfirm={state.confirmSignOut} onCancel={state.cancelSignOut} />
  </>;
}
const styles = StyleSheet.create({ heading: { gap: spacing.md, marginBottom: spacing.lg }, preferences: { gap: spacing.md }, rows: { gap: spacing.lg }, logout: { marginTop: spacing.pageTop } });
