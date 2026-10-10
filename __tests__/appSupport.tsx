/**
 * Renderer helpers for account access and integrated student flows.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import App from '../App';
import { TEST_CREDENTIALS } from '@/test/apiFixtures';
import { resetApiStub } from '@/test/fetchStub';
type Instance = ReactTestRenderer.ReactTestInstance;
// Native stacks retain inactive forms; tests interact only with the focused route.
function isActive(node: Instance): boolean {
  let ancestor: Instance | null = node;
  while (ancestor) {
    if (typeof ancestor.props?.navigation?.isFocused === 'function' && !ancestor.props.navigation.isFocused()) return false;
    ancestor = ancestor.parent;
  }
  return true;
}
/** Flushes HTTP promises and navigation timers. */
export async function flush(): Promise<void> {
  await ReactTestRenderer.act(async () => { jest.runAllTimers(); });
}
/** Presses a control by its accessible label and waits for navigation. */
export async function press(root: Instance, label: string | RegExp): Promise<void> {
  const matches = root.findAll(node => isActive(node) && typeof node.props?.onPress === 'function' && typeof node.props.accessibilityLabel === 'string' &&
    (typeof label === 'string' ? node.props.accessibilityLabel === label : label.test(node.props.accessibilityLabel)));
  if (!matches.length) throw new Error(`Nothing to press with label ${label}`);
  await ReactTestRenderer.act(async () => { matches[0].props.onPress(); });
  await flush(); await flush();
}
/** Changes a form field by its accessible label. */
export async function type(root: Instance, label: string, value: string): Promise<void> {
  const field = root.findAll(node => isActive(node) && typeof node.props?.onChangeText === 'function' && node.props.accessibilityLabel === label)[0];
  await ReactTestRenderer.act(async () => { field.props.onChangeText(value); });
}
/** Determines whether a visible native text node contains the exact copy. */
export function hasText(root: Instance, text: string): boolean {
  return root.findAll(node => String(node.type) === 'Text' && [node.props.children].flat().join('') === text).length > 0;
}
/** Renders the signed-out application with independent generic HTTP fixtures. */
export async function renderApp(): Promise<ReactTestRenderer.ReactTestRenderer> {
  resetApiStub();
  let tree: ReactTestRenderer.ReactTestRenderer | undefined;
  await ReactTestRenderer.act(async () => { tree = ReactTestRenderer.create(<App />); });
  await flush(); await flush();
  return tree!;
}
/** Authenticates the generic student account through the sign-in form. */
export async function signInDemo(root: Instance): Promise<void> {
  await type(root, 'Correo universitario', TEST_CREDENTIALS.email);
  await type(root, 'Contraseña', TEST_CREDENTIALS.password);
  await press(root, 'Iniciar sesión');
}
/** Unmounts the renderer and clears delayed navigation work. */
export async function dispose(tree: ReactTestRenderer.ReactTestRenderer): Promise<void> {
  await ReactTestRenderer.act(async () => { tree.unmount(); jest.runAllTimers(); });
}
