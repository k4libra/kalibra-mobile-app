/**
 * Registration screen and duplicate-email recovery states.
 *
 * @author MRamirez202210582
 * @packageDocumentation
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthHeader } from '@/components/auth';
import { AuthLayout } from '@/components/layout';
import { Button, Callout, Icon, Text, TextField } from '@/components/ui';
import { useAuthForm } from '@/hooks/useAuthForm';
import type { RootStackParamList } from '@/navigation/types';
import { colors, radius, spacing } from '@/theme/tokens';
type Props = NativeStackScreenProps<RootStackParamList, 'SignUp'>;
/** Shows registration, inline validation and email recovery using {@link useAuthForm}. */
export function SignUpScreen({ navigation }: Props) {
  const form = useAuthForm('signUp');
  const openSignIn = () => navigation.navigate('SignIn');
  return <AuthLayout variant="signUp">
    <AuthHeader isRegistration title="Crea tu cuenta en Kalibra" subtitle="Aprende matemática y algoritmos a tu propio ritmo." />
    <View style={styles.role}><Icon name="school" color={colors.white} /><Text variant="labelL" color="onPrimary">Estudiante</Text></View>
    <View style={styles.fields}>
      <TextField variant="compact" label="Nombre completo" icon="badge" value={form.fullName} onChangeText={form.setFullName} error={form.fieldErrors.fullName} placeholder="Ingresa tu nombre completo" autoCapitalize="words" autoComplete="name" editable={!form.isSubmitting} />
      <TextField variant="compact" label="Correo institucional" icon="alternate_email" value={form.email} onChangeText={form.setEmail} error={form.emailError} hint="Dominio .edu" placeholder="tu.correo@universidad.edu" keyboardType="email-address" autoComplete="email" editable={!form.isSubmitting} />
      <TextField variant="compact" label="Contraseña" icon="lock" value={form.password} onChangeText={form.setPassword} error={form.fieldErrors.password} placeholder="Crea una contraseña" secureTextEntry autoComplete="new-password" helperText="Mínimo 8 caracteres" helperHint="Usa letras y números" editable={!form.isSubmitting} onSubmitEditing={form.submit} />
    </View>
    <Callout title="Plan de estudio personalizado" description={form.preview?.planDescription ?? 'Contenido adaptado a tu aprendizaje'} icon="calculate" iconTone="success" variant="inline" />
    {form.error && !form.isDuplicate && <Callout description={form.error.message} tone="danger" icon="info" />}
    <Button label={form.isDuplicate ? 'Iniciar sesión' : 'Crear cuenta'} icon="arrow_forward" loading={form.isSubmitting} onPress={form.isDuplicate ? openSignIn : form.submit} />
    {form.isDuplicate && <Button label="Usar otro correo" variant="ghost" size="sm" onPress={form.useAnotherEmail} />}
    <View style={styles.footer}><View style={styles.login}><Text color="secondary">¿Ya tienes una cuenta?</Text><Button label="Iniciar sesión" variant="ghost" size="sm" onPress={openSignIn} /></View><View style={styles.security}><Icon name="lock" size="xs" color={colors.contentMuted} /><Text variant="labelM" color="muted">Tus datos académicos están protegidos</Text></View></View>
  </AuthLayout>;
}
const styles = StyleSheet.create({ role: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.md, padding: spacing.lg, backgroundColor: colors.primaryStrong, borderRadius: radius.sm }, fields: { gap: spacing.xl, marginTop: spacing.md }, footer: { gap: spacing.xs }, login: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }, security: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.xs } });
