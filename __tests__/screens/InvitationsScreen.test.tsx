/**
 * Tests for the invitations screen.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { InvitationsScreen } from '@/screens/InvitationsScreen';
import type { RootScreenProps } from '@/navigation/types';

jest.useFakeTimers();

async function renderScreen() {
  const navigation = { navigate: jest.fn(), replace: jest.fn(), goBack: jest.fn() };
  const props = { navigation, route: { key: 'Invitations', name: 'Invitations' } } as unknown as RootScreenProps<'Invitations'>;
  let tree: ReactTestRenderer.ReactTestRenderer | undefined;
  ReactTestRenderer.act(() => {
    tree = ReactTestRenderer.create(<InvitationsScreen {...props} />);
  });
  await ReactTestRenderer.act(async () => {
    jest.runAllTimers();
  });
  return { root: tree!.root, navigation };
}

const pressButton = (root: ReactTestRenderer.ReactTestInstance, label: string) =>
  ReactTestRenderer.act(() => {
    root.findAll(node => node.props.accessibilityRole === 'button' && node.props.accessibilityLabel === label)[0].props.onPress();
  });

describe('InvitationsScreen', () => {
  it('opens the enrollment confirmation after accepting', async () => {
    const { root, navigation } = await renderScreen();
    pressButton(root, 'Aceptar');
    pressButton(root, 'Sí, unirme al curso');
    await ReactTestRenderer.act(async () => {
      jest.runAllTimers();
    });
    expect(navigation.replace).toHaveBeenCalledWith('EnrollmentConfirmed', { invitationId: 'inv-1' });
  });

  it('shows the empty pending state after rejecting the only invitation', async () => {
    const { root } = await renderScreen();
    pressButton(root, 'Rechazar');
    pressButton(root, 'Sí, rechazar');
    await ReactTestRenderer.act(async () => {
      jest.runAllTimers();
    });
    expect(root.findAll(node => node.props.children === 'No tienes invitaciones pendientes').length).toBeGreaterThan(0);
  });
});
