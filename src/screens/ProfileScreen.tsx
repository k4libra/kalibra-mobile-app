import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ProfileSummary } from '@/components/auth';
import { AppHeader, ScreenContainer } from '@/components/layout';
import { ConfirmDialog, ErrorState, ListRow, LoadingState, StatStrip, Text } from '@/components/ui';
import { useCurrentStudent } from '@/hooks/useCurrentStudent';
import { useProfile } from '@/hooks/useProfile';
import { colors } from '@/theme/tokens';

/** Academic identity, account statistics and persisted study preferences. */
export function ProfileScreen() {
  const { student } = useCurrentStudent();
  const state = useProfile();
  const profile = state.profile;
  return (
    <>
      <ScreenContainer variant="profile" header={<AppHeader avatar={student?.avatar} />}>
        <View style={styles.heading}>
          <Text variant="headlineL" isHeading>Mi perfil</Text>
          <Text color="secondary">Gestiona tus credenciales académicas, estadísticas y preferencias de aprendizaje.</Text>
        </View>
        {state.error && <ErrorState message={state.error} />}
        {state.isLoading ? <LoadingState /> : profile && (
          <>
            <ProfileSummary user={profile.user} stats={profile.stats} avatar={student?.avatar} />
            <StatStrip items={[
              { icon: 'menu_book', value: profile.stats.solvedExerciseCount, label: 'Ejercicios\nresueltos' },
              { icon: 'target', value: profile.stats.averageMastery === null ? '—' : `${profile.stats.averageMastery}%`, label: 'Dominio promedio', tone: 'success' },
              { icon: 'layers', value: profile.stats.activeCourseCount, label: 'Cursos activos', tone: 'warning' },
            ]} />
            <Text variant="headlineM" isHeading>Preferencias académicas</Text>
            <View style={styles.rows}>
              <ListRow title="Modo nocturno" description="Optimizado para sesiones de estudio tarde" icon="dark_mode" value={profile.preferences.darkMode} disabled={state.isSubmitting} onValueChange={state.setDarkMode} />
              <View style={styles.divider} />
              <ListRow title="Recordatorios diarios" description={profile.preferences.dailyReminders ? 'Recordatorios activados' : 'Notificaciones desactivadas'} icon="alarm" tone="success" value={profile.preferences.dailyReminders} disabled={state.isSubmitting} onValueChange={state.setDailyReminders} />
            </View>
            <View style={styles.rows}><ListRow title="Cerrar sesión" description="Saldrás de Kalibra en este dispositivo" icon="logout" tone="danger" onPress={state.requestSignOut} /></View>
          </>
        )}
      </ScreenContainer>
      <ConfirmDialog
        isVisible={state.isSignOutVisible}
        icon="logout"
        tone="danger"
        title="¿Deseas cerrar sesión en Kalibra?"
        description="Tu progreso de estudio y dominio por subtema están sincronizados en tu cuenta institucional."
        confirmLabel="Sí, cerrar sesión"
        confirmIcon="logout"
        onConfirm={state.confirmSignOut}
        onCancel={state.cancelSignOut}
      />
    </>
  );
}

const styles = StyleSheet.create({
  heading: { gap: 6 },
  rows: { borderRadius: 20, backgroundColor: colors.white, overflow: 'hidden' },
  divider: { height: 1, backgroundColor: colors.surfaceBorder },
});
