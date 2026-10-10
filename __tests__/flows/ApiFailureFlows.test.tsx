/**
 * Tests API failure states and refreshes across retained navigation screens.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import ReactTestRenderer from 'react-test-renderer';
import { apiClient } from '@/services/http/apiClient';
import { jsonResponse } from '@/test/fetchStub';
import { TEST_CREDENTIALS } from '@/test/apiFixtures';
import { dispose, hasText, press, renderApp, signInDemo, type } from '../appSupport';

jest.useFakeTimers();
let tree: ReactTestRenderer.ReactTestRenderer | undefined;
afterEach(async () => { if (tree) await dispose(tree); tree = undefined; jest.restoreAllMocks(); });
test('shows the forbidden mobile-account notice from sign-in', async () => {
  tree = await renderApp();
  jest.spyOn(globalThis, 'fetch').mockResolvedValueOnce(jsonResponse({ status: 403 }, 403));
  await type(tree.root, 'Correo universitario', TEST_CREDENTIALS.email);
  await type(tree.root, 'Contraseña', TEST_CREDENTIALS.password);
  await press(tree.root, 'Iniciar sesión');
  expect(hasText(tree.root, 'Esta cuenta no tiene acceso a la app móvil')).toBe(true);
  expect(tree.root.findAllByProps({ accessibilityRole: 'tab' })).toHaveLength(0);
});
test.each([404, 503])('shows the practice state for HTTP %s without an endless loading indicator', async status => {
  tree = await renderApp();
  await signInDemo(tree.root);
  await press(tree.root, 'Continuar práctica');
  const spy = jest.spyOn(globalThis, 'fetch');
  const original = spy.getMockImplementation()!;
  spy.mockImplementation((url, init) => String(url).endsWith('/practice-exercises') ? Promise.resolve(jsonResponse({ status }, status)) : original(url, init));
  await press(tree.root, /^(Practicar|Comenzar)$/);
  expect(hasText(tree.root, status === 404 ? 'Aún no hay ejercicios aprobados para este subtema' : 'Servicio no disponible por el momento')).toBe(true);
  expect(tree.root.findAllByProps({ accessibilityLabel: 'Enviar respuesta' })).toHaveLength(0);
  expect(tree.root.findAll(node => String(node.type) === 'ActivityIndicator')).toHaveLength(0);
});
test('removes the authenticated navigation when a protected endpoint returns 401', async () => {
  tree = await renderApp();
  await signInDemo(tree.root);
  jest.spyOn(globalThis, 'fetch').mockResolvedValueOnce(jsonResponse({ status: 401 }, 401));
  await ReactTestRenderer.act(async () => { await apiClient.get('/student-preferences/me').catch(() => undefined); });
  expect(hasText(tree.root, '¡Hola de nuevo!')).toBe(true);
  expect(tree.root.findAllByProps({ accessibilityRole: 'tab' })).toHaveLength(0);
});
test('refreshes the retained history tab after submitting an exercise', async () => {
  tree = await renderApp();
  await signInDemo(tree.root);
  await press(tree.root, 'Historial');
  expect(hasText(tree.root, '67% aciertos')).toBe(true);
  await press(tree.root, 'Cursos');
  await press(tree.root, 'Continuar práctica');
  await press(tree.root, /^(Practicar|Comenzar)$/);
  await press(tree.root, /^Opción A/);
  await press(tree.root, 'Enviar respuesta');
  await press(tree.root, 'Volver');
  await press(tree.root, 'Volver');
  await press(tree.root, 'Historial');
  expect(hasText(tree.root, '75% aciertos')).toBe(true);
});
