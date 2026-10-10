/**
 * Behavior tests for the shared account access primitives.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { TextField, Checkbox, Toggle, Callout, Button, ConfirmDialog, Avatar, StatCard } from '@/components/ui';
import { Modal } from 'react-native';
let tree: ReactTestRenderer.ReactTestRenderer;
function render(element: React.ReactElement) { ReactTestRenderer.act(() => { tree = ReactTestRenderer.create(element); }); return tree.root; }
function press(label: string) { ReactTestRenderer.act(() => { tree.root.findAll(node => node.props?.accessibilityLabel === label && typeof node.props.onPress === 'function')[0].props.onPress(); }); }
afterEach(() => ReactTestRenderer.act(() => tree?.unmount()));
test('changes password visibility without losing the entered value', () => {
  const root = render(<TextField label="Password" value="Example2025!" secureTextEntry />);
  const input = () => root.findAll(node => node.props?.accessibilityLabel === 'Password' && 'secureTextEntry' in node.props)[0];
  expect(input().props.secureTextEntry).toBe(true);
  press('Mostrar contraseña');
  expect(input().props.secureTextEntry).toBe(false);
  expect(input().props.value).toBe('Example2025!');
  press('Ocultar contraseña');
  expect(input().props.secureTextEntry).toBe(true);
});
test('displays wrapped validation feedback associated with the field', () => {
  const root = render(<TextField label="Email" error="Address already registered" />);
  expect(root.findAllByProps({ accessibilityRole: 'alert' }).length).toBeGreaterThan(0);
  expect(root.findAllByProps({ accessibilityHint: 'Address already registered' }).length).toBeGreaterThan(0);
});
test('emits checkbox and switch changes with accessible checked state', () => {
  const onChange = jest.fn();
  const root = render(<><Checkbox label="Remember" value onValueChange={onChange} /><Toggle label="Night mode" value={false} onValueChange={onChange} /></>);
  expect(root.findAllByProps({ accessibilityRole: 'checkbox' })[0].props.accessibilityState.checked).toBe(true);
  press('Remember'); press('Night mode');
  expect(onChange.mock.calls).toEqual([[false], [true]]);
});
test('blocks disabled password visibility, checkbox and switch controls', () => {
  const callback = jest.fn();
  const root = render(<><TextField label="Password" editable={false} secureTextEntry /><Checkbox label="Remember" value onValueChange={callback} disabled /><Toggle label="Night mode" value onValueChange={callback} disabled /></>);
  for (const label of ['Mostrar contraseña', 'Remember', 'Night mode']) {
    expect(root.findAll(node => node.props?.accessibilityLabel === label && typeof node.props.onPress === 'function')[0].props.disabled).toBe(true);
  }
});
test('dismisses a notice through its named action', () => {
  const dismiss = jest.fn();
  render(<Callout description="Try again" tone="danger" onDismiss={dismiss} />);
  press('Descartar aviso'); expect(dismiss).toHaveBeenCalledTimes(1);
});
test('marks a loading submit button as busy and disabled', () => {
  const root = render(<Button label="Submit" loading onPress={jest.fn()} />);
  const button = root.findAllByProps({ accessibilityRole: 'button' })[0];
  expect(button.props.accessibilityState).toEqual({ disabled: true, busy: true });
  expect(button.props.disabled).toBe(true);
});
test('cancels a confirmation through the action or native back request', () => {
  const cancel = jest.fn(); const confirm = jest.fn();
  const root = render(<ConfirmDialog isVisible icon="power_settings_new" title="Sign out?" description="Ends the session" confirmLabel="Confirm" onConfirm={confirm} onCancel={cancel} />);
  press('Cancelar'); root.findByType(Modal).props.onRequestClose();
  expect(cancel).toHaveBeenCalledTimes(2);
  press('Confirm'); expect(confirm).toHaveBeenCalledTimes(1);
});
test('renders an initials fallback and a zero statistic without a photo', () => {
  const root = render(<><Avatar name="Student Example" /><StatCard value="0" label="Exercises" icon="check_circle" tone="success" /></>);
  expect(root.findAllByProps({ children: 'SE' }).length).toBeGreaterThan(0);
  expect(root.findAllByProps({ children: '0' }).length).toBeGreaterThan(0);
});
