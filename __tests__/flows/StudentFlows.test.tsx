/**
 * End-to-end navigation flows of the student app across the integrated screens.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import App from '../../App';

jest.useFakeTimers();

type Instance = ReactTestRenderer.ReactTestInstance;

async function flush() {
  await ReactTestRenderer.act(async () => {
    jest.runAllTimers();
  });
}

async function renderApp() {
  let tree: ReactTestRenderer.ReactTestRenderer | undefined;
  await ReactTestRenderer.act(async () => {
    tree = ReactTestRenderer.create(<App />);
  });
  await flush();
  return tree!;
}

// Presses the first pressable whose accessibility label matches.
async function press(root: Instance, label: string | RegExp) {
  const matches = root.findAll(
    node =>
      typeof node.props.onPress === 'function' &&
      typeof node.props.accessibilityLabel === 'string' &&
      (typeof label === 'string' ? node.props.accessibilityLabel === label : label.test(node.props.accessibilityLabel)),
  );
  if (matches.length === 0) throw new Error(`Nothing to press with label ${label}`);
  await ReactTestRenderer.act(async () => {
    matches[0].props.onPress();
  });
  // Simulated services answer after a timer; a navigation may trigger a second request.
  await flush();
  await flush();
}

const hasText = (root: Instance, text: string) =>
  root.findAll(node => String(node.type) === 'Text' && [node.props.children].flat().join('') === text).length > 0;

afterEach(() => jest.clearAllTimers());

test('practices a subtopic from my courses and continues after the result', async () => {
  const tree = await renderApp();
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
  await press(tree.root, 'Notificaciones');
  expect(hasText(tree.root, 'Invitaciones a cursos')).toBe(true);
  await press(tree.root, 'Aceptar');
  await press(tree.root, 'Sí, unirme al curso');
  expect(hasText(tree.root, '¡Ya estás inscrito!')).toBe(true);
  await press(tree.root, 'Ir al curso');
  expect(hasText(tree.root, 'Temas de aprendizaje')).toBe(true);
  await ReactTestRenderer.act(async () => tree.unmount());
});
