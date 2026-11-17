/**
 * End-to-end navigation flows of the student app across the integrated screens.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import ReactTestRenderer from 'react-test-renderer';
import { AppState } from 'react-native';
import { renderApp, signInDemo, press, hasText, dispose } from '../appSupport';
import { AnswerOptionCard, CodeBlock, FormulaBlock, SessionSegments } from '@/components/practice';
import { ExerciseResultScreen } from '@/screens/ExerciseResultScreen';
import { Button, Chip } from '@/components/ui';
import { ExerciseScreen } from '@/screens/ExerciseScreen';
import { jsonResponse } from '@/test/fetchStub';
import { TEST_COURSES } from '@/test/apiFixtures';
import { CourseSubtopicsScreen } from '@/screens/CourseSubtopicsScreen';

jest.useFakeTimers();
afterEach(() => jest.clearAllTimers());

test.each([['Profesor Test Uno', 'Profesor Test Uno'], [null, 'Docente no disponible']])('shows teacher %s on the enrolled card and course header', async (teacherName, label) => {
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
    const headerLabel = teacherName ? `Docente: ${teacherName}` : label!;
    expect(tree.root.findByType(CourseSubtopicsScreen).findAll(node => String(node.type) === 'Text' && [node.props.children].flat().join('').includes(headerLabel)).length).toBeGreaterThan(0);
  } finally { await dispose(tree); }
});

test('practices a subtopic from my courses and continues after the result', async () => {
  const tree = await renderApp();
  await signInDemo(tree.root);
  await press(tree.root, 'Continuar práctica');
  expect(hasText(tree.root, 'Temas de aprendizaje')).toBe(true);
  await press(tree.root, /^(Practicar|Comenzar)$/);
  const initialContext = tree.root.findByType(ExerciseScreen).props.route.params.calibration;
  expect(initialContext).toEqual({ name: 'Recursividad y Backtracking', mastery: 81 });
  await press(tree.root, /^Opción A/);
  await press(tree.root, 'Enviar respuesta');
  expect(hasText(tree.root, '¡Respuesta correcta!')).toBe(true);
  await press(tree.root, 'Continuar practicando');
  expect(tree.root.findByType(ExerciseScreen).props.route.params.calibration).toEqual({ name: initialContext.name, mastery: 81 });
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
      expect(screen.findAllByType(Chip).some(chip => chip.props.label === 'Dificultad adaptativa')).toBe(true);
      await press(tree.root, /^Opción A/);
      await press(tree.root, 'Enviar respuesta');
      expect(hasText(tree.root, `Ejercicio ${position} de 5`)).toBe(true);
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

test('renders generated code and mapped difficulty without gamification', async () => {
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


test('pauses the real exercise timer and controls, then resumes with the selection intact', async () => {
  const stateDescriptor = Object.getOwnPropertyDescriptor(AppState, 'currentState');
  Object.defineProperty(AppState, 'currentState', { configurable: true, value: 'active', writable: true });
  const tree = await renderApp();
  const readSeconds = () => {
    const clock = tree.root.findByType(ExerciseScreen).findAll(node => String(node.type) === 'Text' && typeof node.props.children === 'string' && /^\d{2}:\d{2}$/.test(node.props.children))[0];
    const [minutes, seconds] = String(clock.props.children).split(':').map(Number);
    return minutes * 60 + seconds;
  };
  try {
    await signInDemo(tree.root);
    jest.mocked(globalThis.fetch).mockClear();
    await press(tree.root, 'Continuar práctica');
    await press(tree.root, /^(Practicar|Comenzar)$/);
    await press(tree.root, /^Opción A/);
    const before = readSeconds();
    await ReactTestRenderer.act(async () => { jest.advanceTimersByTime(12000); });
    expect(readSeconds()).toBe(before + 12);
    await press(tree.root, 'Pausar práctica');
    expect(hasText(tree.root, 'Práctica en pausa')).toBe(true);
    const pausedAt = readSeconds();
    await ReactTestRenderer.act(async () => { jest.advanceTimersByTime(65000); });
    expect(readSeconds()).toBe(pausedAt);
    const exerciseScreen = tree.root.findByType(ExerciseScreen);
    expect(exerciseScreen.findAllByType(AnswerOptionCard).every(card => card.props.disabled)).toBe(true);
    const submitButton = exerciseScreen.findAllByType(Button).find(button => button.props.label === 'Enviar respuesta')!;
    expect(submitButton.props.disabled).toBe(true);
    const requestsBefore = jest.mocked(globalThis.fetch).mock.calls.filter(([url]) => String(url).endsWith('/exercise-attempts')).length;
    await ReactTestRenderer.act(async () => { await submitButton.props.onPress(); });
    expect(jest.mocked(globalThis.fetch).mock.calls.filter(([url]) => String(url).endsWith('/exercise-attempts'))).toHaveLength(requestsBefore);
    await press(tree.root, 'Continuar práctica');
    expect(hasText(tree.root, 'Práctica en pausa')).toBe(false);
    expect(tree.root.findByType(ExerciseScreen).findAllByType(AnswerOptionCard).find(card => card.props.option.id === 'A')?.props.isSelected).toBe(true);
    const resumedAt = readSeconds();
    await ReactTestRenderer.act(async () => { jest.advanceTimersByTime(3000); });
    expect(readSeconds()).toBe(resumedAt + 3);
    const submittedSeconds = readSeconds();
    await press(tree.root, 'Enviar respuesta');
    expect(hasText(tree.root, '¡Respuesta correcta!')).toBe(true);
    const submissions = jest.mocked(globalThis.fetch).mock.calls.filter(([url, init]) => String(url).endsWith('/exercise-attempts') && init?.method === 'POST');
    expect(submissions).toHaveLength(1);
    expect(JSON.parse(String(submissions[0][1]?.body)).timeSpentSeconds).toBe(submittedSeconds);
  } finally {
    await dispose(tree);
    if (stateDescriptor) Object.defineProperty(AppState, 'currentState', stateDescriptor);
  }
});

test('renders a supplied mathematical expression and keeps its final question in the question callout', async () => {
  const tree = await renderApp();
  const fetchSpy = jest.mocked(globalThis.fetch);
  const original = fetchSpy.getMockImplementation()!;
  const formula = 'F(x,y) = x^{2}y + xy^{2}';
  fetchSpy.mockImplementation((url, init) => String(url).endsWith('/practice-exercises')
    ? Promise.resolve(jsonResponse({ exerciseId: 'math-exercise', subtopicId: 'sub-1', statement: `Considera el campo:\n$$${formula}$$\n¿Cuál es la divergencia?`, options: ['4xy', '2xy', '0', 'x+y'], difficulty: 'EASY' }, 201))
    : original(url, init));
  try {
    await signInDemo(tree.root);
    await press(tree.root, 'Continuar práctica');
    await press(tree.root, /^(Practicar|Comenzar)$/);
    const screen = tree.root.findByType(ExerciseScreen);
    expect(screen.findByType(FormulaBlock).props.source).toBe(formula);
    expect(hasText(screen, 'F(x,y) = x²y + xy²')).toBe(true);
    expect(hasText(screen, '¿Cuál es la divergencia?')).toBe(true);
    expect(screen.findAllByType(CodeBlock)).toHaveLength(0);
    expect(screen.findAllByType(Chip).some(chip => chip.props.label === 'Dificultad adaptativa: Nivel 1')).toBe(true);
  } finally { await dispose(tree); }
});

test('shows the selected and correct answer values returned by the API', async () => {
  const tree = await renderApp();
  try {
    await signInDemo(tree.root);
    jest.mocked(globalThis.fetch).mockClear();
    await press(tree.root, 'Continuar práctica');
    await press(tree.root, /^(Practicar|Comenzar)$/);
    await press(tree.root, /^Opción C/);
    await press(tree.root, 'Enviar respuesta');
    const result = tree.root.findByType(ExerciseResultScreen);
    expect(hasText(result, 'Respuesta incorrecta')).toBe(true);
    expect(hasText(result, 'Tu respuesta')).toBe(true);
    expect(hasText(result, 'C')).toBe(true);
    expect(hasText(result, '8')).toBe(true);
    expect(hasText(result, 'Respuesta correcta')).toBe(true);
    expect(hasText(result, 'A')).toBe(true);
    expect(hasText(result, '9')).toBe(true);
    expect(hasText(result, 'Dónde se rompió tu razonamiento')).toBe(true);
    expect(hasText(result, 'Se suman 5, 3 y 1: el resultado es 9.')).toBe(true);
    const submissions = jest.mocked(globalThis.fetch).mock.calls.filter(([url]) => String(url).endsWith('/exercise-attempts'));
    expect(submissions).toHaveLength(1);
    expect(JSON.parse(String(submissions[0][1]?.body))).toMatchObject({ selectedOptionKey: 'C' });
  } finally { await dispose(tree); }
});
