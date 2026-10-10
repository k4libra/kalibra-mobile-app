/**
 * Signed-out entry screen of the student app.
 *
 * @author MRamirez202210582
 * @packageDocumentation
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthHeader, StudyPreview } from '@/components/auth';
import { AuthLayout } from '@/components/layout';
import { Button, Callout, Checkbox, Icon, Text, TextField } from '@/components/ui';
import { useAuthForm } from '@/hooks/useAuthForm';
import type { RootStackParamList } from '@/navigation/types';
import { colors, spacing } from '@/theme/tokens';
type Props = NativeStackScreenProps<RootStackParamList, 'SignIn'>;
/** Shows sign-in and its independent notice and field states using {@link useAuthForm}. */
export function SignInScreen({ navigation }: Props) {
  const form = useAuthForm('signIn');
  return <AuthLayout>
    <AuthHeader title="¡Hola de nuevo!" subtitle="Ingresa para continuar tus prácticas adaptativas de cálculo y algoritmos." />
    {form.notice && <Callout title="Credenciales incorrectas" description={form.notice} icon="error" tone="danger" onDismiss={form.dismissNotice} />}
    {form.preview && <StudyPreview preview={form.preview} />}
    <View style={styles.fields}>
      <TextField label="Correo universitario" icon="school" value={form.email} onChangeText={form.setEmail} placeholder="tu.correo@universidad.edu" keyboardType="email-address" autoComplete="email"
        isInvalid={Boolean(form.fieldErrors.email)} hint={form.fieldErrors.email ? 'Revisa este dato' : undefined} isHintError editable={!form.isSubmitting} />
      <TextField label="Contraseña" icon="lock" value={form.password} onChangeText={form.setPassword} placeholder="Ingresa tu contraseña" secureTextEntry autoComplete="current-password" error={form.fieldErrors.password} editable={!form.isSubmitting} onSubmitEditing={form.submit} />
    </View>
    <View style={styles.actions}>
      <View style={styles.securityRow}><Checkbox label="Recordar en este dispositivo" value={form.rememberDevice} onValueChange={form.setRememberDevice} disabled={form.isSubmitting} /><View style={styles.secure}><Icon name="shield" size="xs" color={colors.secondaryStrong} /><Text variant="labelM" color="success">Conexión segura</Text></View></View>
      <Button label="Iniciar sesión" icon="arrow_forward" loading={form.isSubmitting} onPress={form.submit} />
    </View>
    <View style={styles.footer}><Text color="secondary">¿No tienes cuenta?</Text><Button label="Regístrate" variant="ghost" size="sm" onPress={() => navigation.navigate('SignUp')} /></View>
  </AuthLayout>;
}
const styles = StyleSheet.create({ fields: { gap: spacing.xl }, actions: { gap: spacing.md, marginTop: -spacing.xl }, securityRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }, secure: { flexDirection: 'row', alignItems: 'center', gap: spacing.xxs }, footer: { marginTop: spacing.xs, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' } });
