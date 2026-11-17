import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthLayout, BrandMark } from '@/components/layout';
import { Button, Callout, Chip, Icon, IconBox, Text, TextField } from '@/components/ui';
import { useAuthForm } from '@/hooks/useAuthForm';
import type { RootStackParamList } from '@/navigation/types';
import { colors } from '@/theme/tokens';

type Props = NativeStackScreenProps<RootStackParamList, 'SignIn'>;

/** Institutional account access with independent field and notice state. */
export function SignInScreen({ navigation }: Props) {
  const form = useAuthForm('signIn');
  return (
    <AuthLayout>
      <View style={styles.brand}>
        <View style={styles.wordmark}><BrandMark size={40} /><Text style={styles.brandText}>Kalibra</Text></View>
        <Chip label="Red universitaria activa" icon="verified" tone="success" />
      </View>
      <View style={styles.heading}>
        <Text variant="display" isHeading>¡Hola de nuevo!</Text>
        <Text color="secondary">Ingresa para continuar con tus prácticas adaptativas de cálculo y algoritmos.</Text>
      </View>
      {form.notice && (
        <Callout
          title={form.error?.code === 'INVALID_CREDENTIALS' ? 'Credenciales incorrectas' : 'No se pudo iniciar sesión'}
          description={form.notice}
          icon="error"
          tone="danger"
          onDismiss={form.dismissNotice}
        />
      )}
      <View style={styles.domainInfo}>
        <IconBox icon="trending_up" size="md" />
        <View style={styles.infoCopy}>
          <Text variant="labelL">Tu dominio se actualiza con cada ejercicio</Text>
          <Text variant="bodyM" color="secondary">{form.preview?.description ?? 'Tu próxima sesión de práctica te espera.'}</Text>
        </View>
      </View>
      <View style={styles.form}>
        <TextField
          label="Correo universitario"
          icon="mail"
          value={form.email}
          onChangeText={form.setEmail}
          placeholder="tu.correo@universidad.edu"
          keyboardType="email-address"
          autoComplete="email"
          error={form.fieldErrors.email}
          isInvalid={Boolean(form.fieldErrors.email)}
          editable={!form.isSubmitting}
        />
        <TextField
          label="Contraseña"
          icon="lock"
          value={form.password}
          onChangeText={form.setPassword}
          placeholder="Ingresa tu contraseña"
          secureTextEntry
          autoComplete="current-password"
          error={form.fieldErrors.password}
          editable={!form.isSubmitting}
          onSubmitEditing={form.submit}
        />
        <View style={styles.options}>
          <Pressable
            accessibilityRole="checkbox"
            accessibilityLabel="Recordar en este dispositivo"
            accessibilityState={{ checked: form.rememberDevice, disabled: form.isSubmitting }}
            disabled={form.isSubmitting}
            hitSlop={10}
            onPress={() => form.setRememberDevice(!form.rememberDevice)}
            style={styles.remember}
          >
            <View style={[styles.checkbox, form.rememberDevice && styles.checked]}>
              {form.rememberDevice && <Icon name="check" size="xs" color={colors.white} />}
            </View>
            <Text variant="bodyM" color="secondary">Recordar en este dispositivo</Text>
          </Pressable>
          <View style={styles.secure}><Icon name="lock" size="xs" color={colors.secondaryStrong} /><Text variant="bodyMBold" color="success">Conexión segura</Text></View>
        </View>
      </View>
      <Button label="Iniciar sesión" icon="arrow_forward" loading={form.isSubmitting} onPress={form.submit} />
      <View style={styles.footer}>
        <Text color="secondary">¿No tienes cuenta?</Text>
        <Pressable accessibilityRole="button" accessibilityLabel="Regístrate" hitSlop={10} onPress={() => navigation.navigate('SignUp')}>
          <Text variant="labelL" color="brand">Regístrate</Text>
        </Pressable>
      </View>
      <View style={styles.securityNote}><Icon name="lock" size="xs" color={colors.contentSecondary} /><Text variant="bodyM" color="secondary">Tus datos académicos están protegidos</Text></View>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  brand: { height: 40, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  wordmark: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  brandText: { fontFamily: 'PlusJakartaSans-ExtraBold', fontSize: 18, lineHeight: 24, letterSpacing: -0.4 },
  heading: { gap: 8 },
  domainInfo: { minHeight: 80, padding: 12, borderRadius: 24, backgroundColor: colors.white, flexDirection: 'row', alignItems: 'center', gap: 12 },
  infoCopy: { flex: 1 },
  form: { padding: 18, borderRadius: 24, backgroundColor: colors.white, gap: 16 },
  options: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  remember: { flexDirection: 'row', alignItems: 'center', gap: 8, minHeight: 20 },
  checkbox: { width: 20, height: 20, borderRadius: 10, borderWidth: 1, borderColor: colors.lineDefault, alignItems: 'center', justifyContent: 'center' },
  checked: { borderColor: colors.primary, backgroundColor: colors.primary },
  secure: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, minHeight: 20 },
  securityNote: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
});
