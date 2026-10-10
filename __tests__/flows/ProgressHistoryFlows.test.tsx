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
  expect(hasText(tree.root, 'FOCO URGENTE')).toBe(true);
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
  expect(hasText(tree.root, '74% aciertos')).toBe(true);
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
