/**
 * Smoke test of the app root.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import App from '../App';

jest.useFakeTimers();

test('renders the main tabs', async () => {
  let tree: ReactTestRenderer.ReactTestRenderer | undefined;
  await ReactTestRenderer.act(async () => {
    tree = ReactTestRenderer.create(<App />);
    jest.runAllTimers();
  });
  expect(tree?.root.findAllByProps({ accessibilityRole: 'tab' }).length).toBeGreaterThanOrEqual(4);
  await ReactTestRenderer.act(async () => {
    tree?.unmount();
    jest.runAllTimers();
  });
});
