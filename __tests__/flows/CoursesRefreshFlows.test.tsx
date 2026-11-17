import ReactTestRenderer from 'react-test-renderer';
import { RefreshControl } from 'react-native';
import { CountBadge } from '@/components/ui';
import { MyCoursesScreen } from '@/screens/MyCoursesScreen';
import { TEST_INVITATION } from '@/test/apiFixtures';
import { jsonResponse } from '@/test/fetchStub';
import { dispose, flush, hasText, renderApp, signInDemo } from '../appSupport';

jest.useFakeTimers();
test('pull-to-refresh refreshes the real bell badge alongside enrolled courses', async () => {
  const tree = await renderApp();
  const fetchSpy = jest.mocked(globalThis.fetch);
  const original = fetchSpy.getMockImplementation()!;
  let pending = 1;
  fetchSpy.mockImplementation((url, init) => String(url).endsWith('/invitations?status=PENDING')
    ? Promise.resolve(jsonResponse(Array.from({ length: pending }, (_, i) => ({ ...TEST_INVITATION, id: `refresh-${i}`, expiresAt: '2099-01-01T00:00:00Z' }))))
    : original(url, init));
  try {
    await signInDemo(tree.root);
    const screen = () => tree.root.findByType(MyCoursesScreen);
    expect(screen().findByType(CountBadge).props.count).toBe(1);
    pending = 2;
    await ReactTestRenderer.act(async () => screen().findByType(RefreshControl).props.onRefresh());
    await flush(); await flush();
    expect(screen().findByType(CountBadge).props.count).toBe(2);
    expect(hasText(screen(), 'Cursos inscritos')).toBe(true);
    pending = 0;
    await ReactTestRenderer.act(async () => screen().findByType(RefreshControl).props.onRefresh());
    await flush(); await flush();
    expect(screen().findAllByType(CountBadge)).toHaveLength(0);
    expect(hasText(screen(), 'Cursos inscritos')).toBe(true);
  } finally { await dispose(tree); }
});
