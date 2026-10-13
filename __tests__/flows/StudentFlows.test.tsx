/**
 * End-to-end navigation flows of the student app across the integrated screens.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import ReactTestRenderer from 'react-test-renderer';
import { renderApp, signInDemo, press, hasText, dispose } from '../appSupport';
import { CodeBlock, SessionSegments } from '@/components/practice';
import { Chip } from '@/components/ui';
import { ExerciseScreen } from '@/screens/ExerciseScreen';
import { jsonResponse } from '@/test/fetchStub';
import { TEST_COURSES } from '@/test/apiFixtures';
import { CourseSubtopicsScreen } from '@/screens/CourseSubtopicsScreen';

jest.useFakeTimers();
afterEach(() => jest.clearAllTimers());

test.each([['Profesor Test Uno', 'Docente: Profesor Test Uno'], [null, 'Docente no disponible']])('shows teacher %s on the enrolled card and course header', async (teacherName, label) => {
  const tree = await renderApp();
  const fetchSpy = jest.mocked(globalThis.fetch);
  const original = fetchSpy.getMockImplementation()!;
  fetchSpy.mockImplementation((url, init) => String(url).endsWith('/students/me/courses')
    ? Promise.resolve(jsonResponse(TEST_COURSES.map(course => ({ ...course, teacherName }))))
    : original(url, init));
  try {
    await signInDemo(tree.root);
    expect(hasText(tree.root, label!)).toBe(true);
    await press(tree.root, 'Continuar práctica');
    expect(hasText(tree.root.findByType(CourseSubtopicsScreen), label!)).toBe(true);
  } finally { await dispose(tree); }
});

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

test('shows five exercises per visit, preserves progress through results and starts a new visit at one', async () => {
  const tree = await renderApp();
  try {
    await signInDemo(tree.root);
    jest.mocked(globalThis.fetch).mockClear();
    await press(tree.root, 'Continuar práctica');
    await press(tree.root, /^(Practicar|Comenzar)$/);
    for (let position = 1; position <= 5; position++) {
      const screen = tree.root.findByType(ExerciseScreen);
      expect(screen.findByType(SessionSegments).props).toMatchObject({ total: 5, reached: position });
      expect(screen.findAllByType(Chip).some(chip => chip.props.label.startsWith('Dificultad adaptativa'))).toBe(false);
      await press(tree.root, /^Opción A/);
      await press(tree.root, 'Enviar respuesta');
      expect(hasText(tree.root, `Ejercicio ${position}/5`)).toBe(true);
      if (position < 5) await press(tree.root, 'Continuar practicando');
    }
    const requests = jest.mocked(globalThis.fetch).mock.calls.filter(([url]) => String(url).endsWith('/practice-exercises'));
    expect(requests).toHaveLength(5);
    await press(tree.root, 'Volver al subtema');
    expect(hasText(tree.root, 'Temas de aprendizaje')).toBe(true);
    await press(tree.root, /^(Practicar|Comenzar)$/);
    expect(tree.root.findByType(ExerciseScreen).findByType(SessionSegments).props.reached).toBe(1);
  } finally { await dispose(tree); }
});

test('resets a partial session when leaving an exercise or its result', async () => {
  const tree = await renderApp();
  try {
    await signInDemo(tree.root);
    await press(tree.root, 'Continuar práctica');
    await press(tree.root, /^(Practicar|Comenzar)$/);
    await press(tree.root, /^Opción A/);
    await press(tree.root, 'Enviar respuesta');
    await press(tree.root, 'Continuar practicando');
    expect(tree.root.findByType(ExerciseScreen).findByType(SessionSegments).props.reached).toBe(2);
    await press(tree.root, 'Volver');
    await press(tree.root, /^(Practicar|Comenzar)$/);
    expect(tree.root.findByType(ExerciseScreen).findByType(SessionSegments).props.reached).toBe(1);
    await press(tree.root, /^Opción A/);
    await press(tree.root, 'Enviar respuesta');
    await press(tree.root, 'Volver');
    await press(tree.root, /^(Practicar|Comenzar)$/);
    expect(tree.root.findByType(ExerciseScreen).findByType(SessionSegments).props.reached).toBe(1);
  } finally { await dispose(tree); }
});

test('renders generated code in a code card and maps the difficulty chip without session points or elapsed time', async () => {
  const tree = await renderApp();
  const fetchSpy = jest.mocked(globalThis.fetch);
  const original = fetchSpy.getMockImplementation()!;
  const source = 'for (int i = 0; i < n; i++) {\n  total += i;\n}';
  fetchSpy.mockImplementation((url, init) => String(url).endsWith('/practice-exercises')
    ? Promise.resolve(jsonResponse({ exerciseId: 'code-exercise', subtopicId: 'sub-1', statement: `Considera:\n\`\`\`java\n${source}\n\`\`\`\n¿Cuál es la complejidad?`, options: ['O(n)', 'O(1)'], difficulty: 'MEDIUM' }, 201))
    : original(url, init));
  try {
    await signInDemo(tree.root);
    await press(tree.root, 'Continuar práctica');
    await press(tree.root, /^(Practicar|Comenzar)$/);
    const screen = tree.root.findByType(ExerciseScreen);
    expect(screen.findByType(CodeBlock).props.snippet).toMatchObject({ source, language: 'java' });
    expect(hasText(screen, 'Considera:')).toBe(true);
    expect(hasText(screen, '¿Cuál es la complejidad?')).toBe(true);
    expect(screen.findAllByType(Chip).some(chip => chip.props.label === 'Dificultad adaptativa: Nivel 2')).toBe(true);
    expect(hasText(screen, '+ pts')).toBe(false);
  } finally { await dispose(tree); }
});
