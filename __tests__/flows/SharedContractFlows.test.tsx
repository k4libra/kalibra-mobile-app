import ReactTestRenderer from 'react-test-renderer';
import { StyleSheet, View } from 'react-native';
import { CodeBlock, ExplanationCard, FormulaBlock } from '@/components/practice';
import { InvitationCard } from '@/components/courses';
import { ExerciseResultScreen } from '@/screens/ExerciseResultScreen';
import { colors } from '@/theme/tokens';
import { TEST_ATTEMPTS, TEST_COURSES, TEST_INVITATION } from '@/test/apiFixtures';
import { jsonResponse } from '@/test/fetchStub';
import type { AttemptDto } from '@/types/api';
import { dispose, hasText, press, renderApp, signInDemo } from '../appSupport';

jest.useFakeTimers();
let tree: ReactTestRenderer.ReactTestRenderer | undefined;
afterEach(async () => {
  if (tree) await dispose(tree);
  tree = undefined;
  jest.restoreAllMocks();
  jest.clearAllTimers();
});

const steps: NonNullable<AttemptDto['explanationSteps']> = [
  { title: 'Identifica los términos', detail: 'La suma contiene tres términos.', kind: 'TEXT' },
  { title: 'Calcula la suma', detail: 'suma = 5 + 3 + 1', kind: 'CODE' },
  { title: 'Comprueba el resultado', detail: '5 + 3 + 1 = 9', kind: 'FORMULA' },
];

test.each([
  ['fresh', true], ['fresh', false], ['history', true], ['history', false],
] as const)('renders %s results (%s correct) with answer colors and the same supplied structured reasoning', async (source, correct) => {
  tree = await renderApp();
  const fetchSpy = jest.mocked(globalThis.fetch);
  const original = fetchSpy.getMockImplementation()!;
  const attempt: AttemptDto = {
    ...TEST_ATTEMPTS[0],
    result: correct ? 'CORRECT' : 'INCORRECT',
    timeSpentSeconds: 102,
    selectedOptionKey: correct ? 'A' : 'C',
    correctOptionKey: 'A',
    options: ['9', '15', '8', 'Ninguna'],
    explanation: 'Texto de compatibilidad que no debe duplicarse.',
    explanationSteps: steps,
    keyIdea: 'Suma cada término una sola vez.',
  };
  fetchSpy.mockImplementation(async (url, init) => {
    const response = await original(url, init);
    if (String(url).endsWith('/exercise-attempts') && init?.method === 'POST') return jsonResponse({ ...attempt, id: 'structured-attempt' }, 201);
    if (String(url).includes('/exercise-attempts?courseId=course-1')) {
      const body = await response.json();
      return jsonResponse({ ...body, content: body.content.map((item: AttemptDto) => item.id === attempt.id ? attempt : item) });
    }
    return response;
  });
  await signInDemo(tree.root);
  fetchSpy.mockClear();
  if (source === 'history') {
    await press(tree.root, 'Historial');
    expect(hasText(tree.root, '1m 42s')).toBe(true);
    expect(hasText(tree.root, 'Sin registro')).toBe(true);
    await press(tree.root, `${attempt.statement}. Ver desglose`);
    expect(fetchSpy.mock.calls.some(([, init]) => init?.method === 'POST')).toBe(false);
  } else {
    await press(tree.root, 'Continuar práctica');
    await press(tree.root, /^(Practicar|Comenzar)$/);
    await press(tree.root, correct ? /^Opción A/ : /^Opción C/);
    await press(tree.root, 'Enviar respuesta');
  }
  const result = tree.root.findByType(ExerciseResultScreen);
  const answerCards = result.findAllByType(View);
  if (correct) {
    // As in the design, a correct answer shows no redundant answer comparison.
    expect(hasText(result, 'Tu respuesta')).toBe(false);
    expect(hasText(result, 'Respuesta correcta')).toBe(false);
  } else {
    const selected = answerCards.find(node => StyleSheet.flatten(node.props.style)?.backgroundColor === colors.dangerContainer)!;
    expect(hasText(selected, 'Tu respuesta')).toBe(true);
    expect(hasText(selected, 'C')).toBe(true);
    expect(hasText(selected, '8')).toBe(true);
    const verified = answerCards.find(node => StyleSheet.flatten(node.props.style)?.backgroundColor === colors.secondaryPale && hasText(node, 'Respuesta correcta'))!;
    expect(hasText(verified, 'A')).toBe(true);
    expect(hasText(verified, '9')).toBe(true);
  }
  const explanation = result.findByType(ExplanationCard);
  for (const [index, step] of steps.entries()) {
    expect(hasText(explanation, String(index + 1))).toBe(true);
    expect(hasText(explanation, step.title)).toBe(true);
  }
  expect(hasText(explanation, steps[0].detail)).toBe(true);
  expect(explanation.findByType(CodeBlock).props.snippet.source).toBe(steps[1].detail);
  expect(explanation.findByType(FormulaBlock).props.source).toBe(steps[2].detail);
  expect(hasText(explanation, 'Idea clave')).toBe(true);
  expect(hasText(explanation, attempt.keyIdea!)).toBe(true);
  expect(hasText(explanation, attempt.explanation)).toBe(false);
});

test('shows real expired invitations with sender identity and resend guidance, without actions', async () => {
  tree = await renderApp();
  const fetchSpy = jest.mocked(globalThis.fetch);
  const original = fetchSpy.getMockImplementation()!;
  fetchSpy.mockImplementation((url, init) => String(url).endsWith('/invitations?status=EXPIRED')
    ? Promise.resolve(jsonResponse([{ ...TEST_INVITATION, id: 'expired-1', courseId: 'course-5', teacherName: 'Profesora de Estadística', status: 'EXPIRED', expiresAt: '2020-01-01T12:00:00Z' }]))
    : original(url, init));
  await signInDemo(tree.root);
  await press(tree.root, 'Notificaciones');
  expect(hasText(tree.root, 'Vencidas')).toBe(true);
  const expired = tree.root.findAllByType(InvitationCard).find(node => node.props.invitation.status === 'expired')!;
  expect(expired.props.invitation.courseId).toBe('course-5');
  expect(hasText(expired, 'Profesora de Estadística')).toBe(true);
  expect(hasText(expired, 'Esta invitación venció sin respuesta. Pide a tu docente que te la reenvíe para unirte al curso.')).toBe(true);
  expect(expired.findAll(node => node.props.accessibilityRole === 'button')).toHaveLength(0);
});

test('uses the API academic term on courses and profile', async () => {
  tree = await renderApp();
  const fetchSpy = jest.mocked(globalThis.fetch);
  const original = fetchSpy.getMockImplementation()!;
  fetchSpy.mockImplementation((url, init) => String(url).endsWith('/students/me/courses')
    ? Promise.resolve(jsonResponse(TEST_COURSES.map(course => ({ ...course, term: '2025-I' }))))
    : original(url, init));
  await signInDemo(tree.root);
  expect(hasText(tree.root, 'Ciclo 2025-I')).toBe(true);
  await press(tree.root, 'Perfil');
  expect(hasText(tree.root, 'Ciclo 2025-I')).toBe(true);
});
