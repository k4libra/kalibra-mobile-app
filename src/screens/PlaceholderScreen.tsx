/**
 * Placeholder for screens that another branch implements.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { AppHeader, ScreenContainer } from '@/components/layout';
import { EmptyState } from '@/components/ui';

/**
 * Props accepted by {@link PlaceholderScreen}.
 */
export interface PlaceholderScreenProps {
  /** Name of the screen that will live on this route. */
  title: string;
  /** Branch that implements the screen, for example `feature/auth-profile`. */
  branch: string;
}

/**
 * Shows which branch owns a route that is not implemented on the current branch.
 */
export function PlaceholderScreen({ title, branch }: PlaceholderScreenProps) {
  const navigation = useNavigation();
  return (
    <ScreenContainer header={<AppHeader title={title} onBack={navigation.canGoBack() ? navigation.goBack : undefined} />}>
      <EmptyState icon="info" title="Pantalla pendiente" description={`Esta pantalla se implementa en la rama ${branch}.`} />
    </ScreenContainer>
  );
}
