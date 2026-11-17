import type ReactTestRenderer from 'react-test-renderer';
import { SessionSegments } from '@/components/practice';
import { CourseSubtopicsScreen } from '@/screens/CourseSubtopicsScreen';
import { ExerciseResultScreen } from '@/screens/ExerciseResultScreen';
import { ExerciseScreen } from '@/screens/ExerciseScreen';
import { dispose, hasText, press, renderApp, signInDemo } from '../appSupport';

jest.useFakeTimers();
let tree: ReactTestRenderer.ReactTestRenderer | undefined;

afterEach(async () => {
  if (tree) await dispose(tree);
  tree = undefined;
  jest.clearAllTimers();
});

function generationRequests() {
  return jest.mocked(globalThis.fetch).mock.calls
    .filter(([url, init]) => String(url).endsWith('/practice-exercises') && init?.method === 'POST')
    .map(([, init]) => JSON.parse(String(init?.body)) as { courseId: string; mode: string });
}

test('requests five express exercises with server-selected subtopics, preserves outcomes and returns to the course', async () => {
  tree = await renderApp();
  await signInDemo(tree.root);
  jest.mocked(globalThis.fetch).mockClear();
  await press(tree.root, 'Iniciar práctica exprés');
  const expectedTopics = ['Recursividad y Backtracking', 'Árboles Binarios de Búsqueda', 'Programación Dinámica', 'Grafos', 'Recursividad y Backtracking'];
  const outcomes = [true, false, true, false, true];
  for (let position = 1; position <= 5; position++) {
    const screen = tree.root.findByType(ExerciseScreen);
    expect(screen.findByType(SessionSegments).props).toMatchObject({ total: 5, reached: position });
    expect(generationRequests()).toHaveLength(position);
    expect(generationRequests()[position - 1]).toEqual({ courseId: 'course-1', mode: 'EXPRESS' });
    expect(hasText(screen, expectedTopics[position - 1])).toBe(true);
    await press(tree.root, outcomes[position - 1] ? /^Opción A/ : /^Opción B/);
    await press(tree.root, 'Enviar respuesta');
    const result = tree.root.findByType(ExerciseResultScreen);
    expect(hasText(result, `Ejercicio ${position} de 5`)).toBe(true);
    expect(result.findByType(SessionSegments).props.outcomes).toEqual(outcomes.slice(0, position));
    if (position < 5) await press(tree.root, 'Continuar practicando');
  }
  expect(generationRequests()).toHaveLength(5);
  const submissions = jest.mocked(globalThis.fetch).mock.calls.filter(([url, init]) => String(url).endsWith('/exercise-attempts') && init?.method === 'POST');
  expect(submissions).toHaveLength(5);
  expect(hasText(tree.root, 'Continuar practicando')).toBe(false);
  await press(tree.root, 'Volver al subtema');
  expect(tree.root.findByType(CourseSubtopicsScreen).props.route.params.courseId).toBe('course-1');
  expect(hasText(tree.root, 'Temas de aprendizaje')).toBe(true);
  expect(tree.root.findAllByType(ExerciseScreen)).toHaveLength(0);
  expect(tree.root.findAllByType(ExerciseResultScreen)).toHaveLength(0);
  expect(generationRequests()).toHaveLength(5);
});

test.each(['exercise', 'result'])('starts a new mixed session after leaving its %s', async destination => {
  tree = await renderApp();
  await signInDemo(tree.root);
  jest.mocked(globalThis.fetch).mockClear();
  await press(tree.root, 'Iniciar práctica exprés');
  await press(tree.root, /^Opción A/);
  await press(tree.root, 'Enviar respuesta');
  if (destination === 'exercise') {
    await press(tree.root, 'Continuar practicando');
    expect(tree.root.findByType(ExerciseScreen).findByType(SessionSegments).props.reached).toBe(2);
  }
  await press(tree.root, 'Volver');
  await press(tree.root, 'Iniciar práctica exprés');
  const exercise = tree.root.findByType(ExerciseScreen);
  expect(exercise.findByType(SessionSegments).props).toMatchObject({ total: 5, reached: 1 });
  expect(generationRequests().at(-1)).toEqual({ courseId: 'course-1', mode: 'EXPRESS' });
  await press(tree.root, /^Opción A/);
  await press(tree.root, 'Enviar respuesta');
  expect(tree.root.findByType(ExerciseResultScreen).findByType(SessionSegments).props.outcomes).toEqual([true]);
});
