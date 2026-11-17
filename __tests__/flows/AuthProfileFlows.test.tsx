/**
 * Account access, registration, preference and logout navigation flows.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { renderApp, type, press, hasText, signInDemo, dispose } from '../appSupport';
import { SignInScreen } from '@/screens/SignInScreen';
import { ProfileScreen } from '@/screens/ProfileScreen';
import { TEST_CREDENTIALS } from '@/test/apiFixtures';
import { StatItem } from '@/components/ui';
import type ReactTestRenderer from 'react-test-renderer';
jest.useFakeTimers();
let tree: ReactTestRenderer.ReactTestRenderer;
afterEach(async () => { if (tree) await dispose(tree); jest.clearAllTimers(); jest.restoreAllMocks(); });
test('keeps invalid login feedback while dismissing the notice and toggling visibility', async () => {
  tree = await renderApp();
  await type(tree.root, 'Correo universitario', TEST_CREDENTIALS.email);
  await type(tree.root, 'Contraseña', 'wrong');
  await press(tree.root, 'Iniciar sesión');
  expect(hasText(tree.root, 'Credenciales incorrectas')).toBe(true);
  await press(tree.root, 'Mostrar contraseña');
  expect(tree.root.findAllByProps({ accessibilityLabel: 'Contraseña', secureTextEntry: false }).length).toBeGreaterThan(0);
  await press(tree.root, 'Descartar aviso');
  expect(hasText(tree.root, 'Credenciales incorrectas')).toBe(false);
  expect(hasText(tree.root, 'Revisa este dato')).toBe(true);
  await press(tree.root, 'Ocultar contraseña'); await press(tree.root, 'Mostrar contraseña');
  await type(tree.root, 'Contraseña', TEST_CREDENTIALS.password);
  await press(tree.root, 'Iniciar sesión');
  expect(hasText(tree.root, 'Cursos inscritos')).toBe(true);
});
test('validates registration, preserves visibility input and offers both duplicate-email actions', async () => {
  tree = await renderApp(); await press(tree.root, 'Regístrate');
  await press(tree.root, 'Crear cuenta');
  expect(hasText(tree.root, 'Ingresa tu nombre completo.')).toBe(true);
  await type(tree.root, 'Nombre completo', 'Student Example');
  await type(tree.root, 'Correo institucional', 'student@gmail.com');
  await type(tree.root, 'Contraseña', 'Example2025!');
  await press(tree.root, 'Mostrar contraseña'); await press(tree.root, 'Crear cuenta');
  expect(hasText(tree.root, 'Ingresa un correo institucional válido (@universidad.edu)')).toBe(true);
  expect(tree.root.findAllByProps({ value: 'Example2025!', secureTextEntry: false }).length).toBeGreaterThan(0);
  await type(tree.root, 'Correo institucional', TEST_CREDENTIALS.email);
  await press(tree.root, 'Crear cuenta');
  expect(hasText(tree.root, 'Ya existe una cuenta con este correo. Inicia sesión o usa otro correo.')).toBe(true);
  await press(tree.root, 'Usar otro correo');
  expect(tree.root.findAllByProps({ accessibilityLabel: 'Correo institucional', value: '' }).length).toBeGreaterThan(0);
  expect(hasText(tree.root, 'Crear cuenta')).toBe(true);
  await type(tree.root, 'Correo institucional', TEST_CREDENTIALS.email); await press(tree.root, 'Crear cuenta');
  await press(tree.root, 'Iniciar sesión');
  expect(hasText(tree.root, '¡Hola de nuevo!')).toBe(true);
});
test('registers into empty courses with zero profile statistics and no demo invitations', async () => {
  tree = await renderApp(); await press(tree.root, 'Regístrate');
  await type(tree.root, 'Nombre completo', 'Student Example');
  await type(tree.root, 'Correo institucional', 'student@campus.edu.pe');
  await type(tree.root, 'Contraseña', 'Example2025!');
  await press(tree.root, 'Crear cuenta');
  expect(hasText(tree.root, 'Aún no estás inscrito en ningún curso')).toBe(true);
  expect(hasText(tree.root, 'Hola, Student')).toBe(true);
  await press(tree.root, 'Perfil');
  expect(hasText(tree.root, 'Student Example')).toBe(true);
  expect(tree.root.findByType(ProfileScreen).findAllByType(StatItem).map(item => [item.props.label, item.props.value])).toEqual([
    ['Ejercicios\nresueltos', 0], ['Dominio promedio', '—'], ['Cursos activos', 0],
  ]);
  expect(hasText(tree.root, 'Dominio promedio · Sin actividad')).toBe(true);
  expect(hasText(tree.root, 'Estudiante Test Uno')).toBe(false);
});
test('navigates all tabs, toggles preferences and cancels or confirms logout without protected back history', async () => {
  tree = await renderApp(); await signInDemo(tree.root);
  await press(tree.root, 'Progreso'); expect(hasText(tree.root, 'Mi progreso')).toBe(true);
  await press(tree.root, 'Historial'); expect(hasText(tree.root, 'Historial de práctica')).toBe(true);
  await press(tree.root, 'Cursos'); expect(hasText(tree.root, 'Cursos inscritos')).toBe(true);
  await press(tree.root, 'Perfil');
  expect(tree.root.findByType(ProfileScreen).findAllByType(StatItem).map(item => [item.props.label, item.props.value])).toEqual([
    ['Ejercicios\nresueltos', 3], ['Dominio promedio', '67%'], ['Cursos activos', 3],
  ]);
  await press(tree.root, 'Modo nocturno');
  expect(tree.root.findAllByProps({ accessibilityLabel: 'Modo nocturno', accessibilityRole: 'switch' })[0].props.accessibilityState.checked).toBe(true);
  await press(tree.root, 'Modo nocturno');
  await press(tree.root, 'Recordatorios diarios');
  expect(hasText(tree.root, 'Notificaciones desactivadas')).toBe(true);
  await press(tree.root, 'Recordatorios diarios'); expect(hasText(tree.root, 'Recordatorios activados')).toBe(true);
  await press(tree.root, 'Cerrar sesión'); expect(hasText(tree.root, '¿Deseas cerrar sesión en Kalibra?')).toBe(true);
  await press(tree.root, 'Cancelar'); expect(hasText(tree.root, 'Mi perfil')).toBe(true);
  await press(tree.root, 'Cerrar sesión'); await press(tree.root, 'Sí, cerrar sesión');
  expect(hasText(tree.root, '¡Hola de nuevo!')).toBe(true);
  expect(tree.root.findAllByProps({ accessibilityRole: 'tab' })).toHaveLength(0);
  expect(tree.root.findByType(SignInScreen).props.navigation.canGoBack()).toBe(false);
});
test('does not show the previous identity or preferences after registering another account', async () => {
  tree = await renderApp(); await signInDemo(tree.root); await press(tree.root, 'Perfil'); await press(tree.root, 'Modo nocturno');
  await press(tree.root, 'Cerrar sesión'); await press(tree.root, 'Sí, cerrar sesión');
  await press(tree.root, 'Regístrate'); await type(tree.root, 'Nombre completo', 'Another Student');
  await type(tree.root, 'Correo institucional', 'another@campus.edu'); await type(tree.root, 'Contraseña', 'Example2025!'); await press(tree.root, 'Crear cuenta');
  expect(hasText(tree.root, 'Hola, Another')).toBe(true); expect(hasText(tree.root, 'Aún no estás inscrito en ningún curso')).toBe(true);
  await press(tree.root, 'Perfil');
  expect(hasText(tree.root, 'Another Student')).toBe(true);
  expect(tree.root.findAllByProps({ accessibilityLabel: 'Modo nocturno', accessibilityRole: 'switch' })[0].props.accessibilityState.checked).toBe(false);
});

test('persists both study preferences through sign-out and a new sign-in', async () => {
  tree = await renderApp();
  await signInDemo(tree.root);
  await press(tree.root, 'Perfil');
  await press(tree.root, 'Modo nocturno');
  await press(tree.root, 'Recordatorios diarios');
  expect(tree.root.findAll(node => node.props.accessibilityRole === 'switch' && node.props.accessibilityLabel === 'Modo nocturno')[0].props.accessibilityState.checked).toBe(true);
  const updates = (globalThis.fetch as jest.Mock).mock.calls.filter(([url, init]) =>
    String(url).endsWith('/student-preferences/me') && init?.method === 'PATCH');
  expect(updates.map(([, init]) => JSON.parse(String(init.body)))).toEqual([
    { darkMode: true }, { dailyReminderEnabled: false },
  ]);
  await press(tree.root, 'Cerrar sesión');
  await press(tree.root, 'Sí, cerrar sesión');
  await signInDemo(tree.root);
  await press(tree.root, 'Perfil');
  expect(tree.root.findAllByProps({ accessibilityRole: 'switch', accessibilityLabel: 'Modo nocturno' })[0].props.accessibilityState.checked).toBe(true);
  expect(tree.root.findAllByProps({ accessibilityRole: 'switch', accessibilityLabel: 'Recordatorios diarios' })[0].props.accessibilityState.checked).toBe(false);
  expect(hasText(tree.root, 'Notificaciones desactivadas')).toBe(true);
});
