/**
 * End-to-end flows of the progress and history tabs.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { dispose, hasText, press, renderApp, signInDemo } from '../appSupport';
import type ReactTestRenderer from 'react-test-renderer';

jest.useFakeTimers();

let tree: ReactTestRenderer.ReactTestRenderer | undefined;

afterEach(async () => {
  if (tree) await dispose(tree);
  tree = undefined;
});

test('reinforces the urgent subtopic from progress and opens the exercise', async () => {
  tree = await renderApp();
  await signInDemo(tree.root);
  await press(tree.root, 'Progreso');
  expect(hasText(tree.root, 'Foco prioritario')).toBe(true);
  expect(hasText(tree.root, 'Programación Dinámica')).toBe(true);
  await press(tree.root, 'Reforzar ahora');
  expect(hasText(tree.root, 'Enviar respuesta')).toBe(true);
});

test('previews the initial progress state and starts practicing from it', async () => {
  tree = await renderApp();
  await signInDemo(tree.root);
  await press(tree.root, 'Progreso');
  await press(tree.root, 'Ver vista inicial');
  expect(hasText(tree.root, 'Aún no estimamos tu dominio')).toBe(true);
  await press(tree.root, 'Empezar a practicar');
  expect(hasText(tree.root, 'Enviar respuesta')).toBe(true);
});

test('filters the history and opens the stored result of an answer', async () => {
  tree = await renderApp();
  await signInDemo(tree.root);
  await press(tree.root, 'Historial');
  expect(hasText(tree.root, '67% aciertos')).toBe(true);
  await press(tree.root, /^Para repasar/);
  expect(hasText(tree.root, 'Matriz de subsecuencia común más larga (LCS)')).toBe(true);
  expect(hasText(tree.root, 'Evaluación de función recursiva misterio(n)')).toBe(false);
  await press(tree.root, /^Todos/);
  expect(hasText(tree.root, 'Evaluación de función recursiva misterio(n)')).toBe(true);
  await press(tree.root, 'Matriz de subsecuencia común más larga (LCS). Ver desglose');
  expect(hasText(tree.root, 'Respuesta incorrecta')).toBe(true);
});

test('shows the empty history and starts the first exercise', async () => {
  tree = await renderApp();
  await signInDemo(tree.root);
  await press(tree.root, 'Historial');
  await press(tree.root, 'Previsualizar historial vacío');
  expect(hasText(tree.root, 'Todavía no tienes historial')).toBe(true);
  await press(tree.root, 'Resolver mi primer ejercicio');
  expect(hasText(tree.root, 'Enviar respuesta')).toBe(true);
});


test('filters correct answers, restores all entries and opens a saved result without posting', async () => {
  tree = await renderApp();
  await signInDemo(tree.root);
  await press(tree.root, 'Historial');
  const requests = jest.mocked(globalThis.fetch);
  requests.mockClear();

  await press(tree.root, /^Correctos/);
  expect(hasText(tree.root, 'Evaluación de función recursiva misterio(n)')).toBe(true);
  expect(hasText(tree.root, 'Rotación simple a la derecha en árbol AVL')).toBe(true);
  expect(hasText(tree.root, 'Matriz de subsecuencia común más larga (LCS)')).toBe(false);
  expect(tree.root.findAll(node => node.props.accessibilityLabel === 'Todos, 3').length).toBeGreaterThan(0);
  expect(tree.root.findAll(node => node.props.accessibilityLabel === 'Correctos, 2').length).toBeGreaterThan(0);
  expect(tree.root.findAll(node => node.props.accessibilityLabel === 'Para repasar, 1').length).toBeGreaterThan(0);
  expect(requests.mock.calls.some(([url]) => String(url).includes('result=CORRECT'))).toBe(true);

  await press(tree.root, /^Todos/);
  expect(hasText(tree.root, 'Matriz de subsecuencia común más larga (LCS)')).toBe(true);
  await press(tree.root, 'Evaluación de función recursiva misterio(n). Ver desglose');
  expect(hasText(tree.root, '¡Respuesta correcta!')).toBe(true);
  expect(hasText(tree.root, 'Se suman 5, 3 y 1: el resultado es 9.')).toBe(true);
  expect(requests.mock.calls.filter(([, init]) => init?.method === 'POST')).toHaveLength(0);
});
