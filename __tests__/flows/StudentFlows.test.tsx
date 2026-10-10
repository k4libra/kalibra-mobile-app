/**
 * End-to-end navigation flows of the student app across the integrated screens.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import ReactTestRenderer from 'react-test-renderer';
import { renderApp, signInDemo, press, hasText } from '../appSupport';

jest.useFakeTimers();
afterEach(() => jest.clearAllTimers());

test('practices a subtopic from my courses and continues after the result', async () => {
  const tree = await renderApp();
  await signInDemo(tree.root);
  await press(tree.root, 'Continuar práctica');
  expect(hasText(tree.root, 'Temas de aprendizaje')).toBe(true);
  await press(tree.root, /^(Practicar|Comenzar)$/);
  await press(tree.root, /^Opción A/);
  await press(tree.root, 'Enviar respuesta');
  expect(hasText(tree.root, '¡Respuesta correcta!')).toBe(true);
  await press(tree.root, 'Continuar practicando');
  expect(hasText(tree.root, '¡Respuesta correcta!')).toBe(false);
  expect(tree.root.findAll(node => node.props.accessibilityLabel === 'Enviar respuesta').length).toBeGreaterThan(0);
  await ReactTestRenderer.act(async () => tree.unmount());
});

test('accepts an invitation from the bell and opens the course', async () => {
  const tree = await renderApp();
  await signInDemo(tree.root);
  await press(tree.root, 'Notificaciones');
  expect(hasText(tree.root, 'Invitaciones a cursos')).toBe(true);
  await press(tree.root, 'Aceptar');
  await press(tree.root, 'Sí, unirme al curso');
  expect(hasText(tree.root, '¡Ya estás inscrito!')).toBe(true);
  await press(tree.root, 'Ir al curso');
  expect(hasText(tree.root, 'Temas de aprendizaje')).toBe(true);
  await ReactTestRenderer.act(async () => tree.unmount());
});
