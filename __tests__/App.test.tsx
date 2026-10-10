/**
 * Smoke tests of the signed-out root and authenticated tabs.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { renderApp, signInDemo, hasText, dispose } from './appSupport';
jest.useFakeTimers();
test('starts at sign-in and renders the main tabs after authentication', async () => {
  const tree = await renderApp();
  try {
    expect(hasText(tree.root, '¡Hola de nuevo!')).toBe(true);
    expect(tree.root.findAllByProps({ accessibilityRole: 'tab' })).toHaveLength(0);
    await signInDemo(tree.root);
    expect(tree.root.findAllByProps({ accessibilityRole: 'tab' }).length).toBeGreaterThanOrEqual(4);
  } finally { await dispose(tree); }
});
