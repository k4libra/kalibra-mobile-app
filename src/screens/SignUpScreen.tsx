import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthLayout, BrandMark } from '@/components/layout';
import { Button, Callout, Chip, Icon, IconBox, Text, TextField } from '@/components/ui';
import { useAuthForm } from '@/hooks/useAuthForm';
import type { RootStackParamList } from '@/navigation/types';
import { colors } from '@/theme/tokens';

type Props = NativeStackScreenProps<RootStackParamList, 'SignUp'>;

/** Student registration and recovery from an existing institutional account. */
export function SignUpScreen({ navigation }: Props) {
  const form = useAuthForm('signUp');
  const openSignIn = () => navigation.navigate('SignIn');
  return (
    <AuthLayout variant="signUp">
      <View style={styles.brand}><BrandMark size={48} /><Chip label="Portal académico" icon="school" /></View>
      <View style={styles.heading}>
        <Text variant="display" isHeading>Crea tu cuenta en Kalibra</Text>
        <Text color="secondary">Aprende matemática y algoritmos a tu propio ritmo.</Text>
        <Chip label="Acceso para universidades asociadas" tone="success" icon="account_balance" />
      </View>
      <View style={styles.role}>
        <IconBox icon="school" size="md" style={styles.whiteTile} />
        <View style={styles.roleCopy}><Text variant="title" color="brand">Estudiante</Text><Text variant="bodyM" color="secondary">Cuenta para practicar desde la app</Text></View>
        <Icon name="check_circle" size="xl" />
      </View>
      <View style={styles.form}>
        <TextField
          label="Nombre completo"
          icon="badge"
          value={form.fullName}
          onChangeText={form.setFullName}
          error={form.fieldErrors.fullName}
          placeholder="Ingresa tu nombre completo"
          autoCapitalize="words"
          autoComplete="name"
          editable={!form.isSubmitting}
        />
        <TextField
          label="Correo institucional"
          icon="mail"
          value={form.email}
          onChangeText={form.setEmail}
          error={form.emailError}
          placeholder="tu.correo@universidad.edu"
          keyboardType="email-address"
          autoComplete="email"
          editable={!form.isSubmitting}
        />
        <TextField
          label="Contraseña"
          icon="lock"
          value={form.password}
          onChangeText={form.setPassword}
          error={form.fieldErrors.password}
          placeholder="Crea una contraseña"
          secureTextEntry
          autoComplete="new-password"
          helperText="Mínimo 8 caracteres · Usa letras y números"
          editable={!form.isSubmitting}
          onSubmitEditing={form.submit}
        />
      </View>
      <View style={styles.studyPlan}>
        <IconBox icon="functions" size="md" tone="success" style={styles.whiteTile} />
        <View style={styles.roleCopy}><Text variant="labelL" color="success">Plan de estudio personalizado</Text><Text variant="bodyM" color="secondary">Cálculo, Álgebra Lineal y Algoritmos</Text></View>
      </View>
      {form.error && !form.isDuplicate && <Callout title="No se pudo crear la cuenta" description={form.error.message} tone="danger" icon="error" />}
      <Button label={form.isDuplicate ? 'Iniciar sesión' : 'Crear cuenta'} icon="arrow_forward" loading={form.isSubmitting} onPress={form.isDuplicate ? openSignIn : form.submit} />
      {form.isDuplicate && <Pressable accessibilityRole="button" accessibilityLabel="Usar otro correo" onPress={form.useAnotherEmail} hitSlop={10} style={styles.anotherEmail}><Text variant="labelL" color="brand">Usar otro correo</Text></Pressable>}
      <View style={styles.footer}>
        <Text color="secondary">¿Ya tienes una cuenta?</Text>
        <Pressable accessibilityRole="button" accessibilityLabel="Iniciar sesión" onPress={openSignIn} hitSlop={10}><Text variant="labelL" color="brand">Iniciar sesión</Text></Pressable>
      </View>
      <View style={styles.securityNote}><Icon name="lock" size="xs" color={colors.contentSecondary} /><Text variant="bodyM" color="secondary">Tus datos académicos están protegidos</Text></View>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  brand: { height: 48, flexDirection: 'row', alignItems: 'center', gap: 12 },
  heading: { gap: 8 },
  role: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, minHeight: 66, borderRadius: 20, borderWidth: 1, borderColor: colors.primary, backgroundColor: colors.primaryContainerSoft },
  roleCopy: { flex: 1 },
  whiteTile: { backgroundColor: colors.white },
  form: { padding: 18, gap: 16, borderRadius: 24, backgroundColor: colors.white },
  studyPlan: { minHeight: 64, flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderRadius: 20, backgroundColor: colors.secondaryPale },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, minHeight: 20 },
  anotherEmail: { alignItems: 'center' },
  securityNote: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
});
