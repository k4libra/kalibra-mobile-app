/**
 * Design tokens of the Kalibra design system for React Native.
 *
 * @remarks
 * Same values as the `@theme` block of `src/index.css` in kalibra-web-app; change both at the same time.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import type { TextStyle, ViewStyle } from 'react-native';

/**
 * Semantic colors of the design system.
 */
export const colors = {
  white: '#ffffff',
  transparent: 'transparent',

  primary: '#4f46e5',
  primaryStrong: '#3525cd',
  primaryContainer: '#e2e7ff',
  primaryContainerSoft: '#eaedff',
  primarySubtle: '#f2f3ff',
  primaryPale: '#c3c0ff',
  primaryPaleSoft: '#e2dfff',

  secondary: '#10b981',
  secondaryStrong: '#006c49',
  secondaryText: '#00714d',
  secondaryContainer: '#6cf8bb',
  secondaryAccent: '#4edea3',

  tertiary: '#f59e0b',
  tertiaryStrong: '#684000',
  tertiaryContainer: '#ffb95f',
  tertiaryPale: '#ffddb8',

  danger: '#ba1a1a',
  dangerStrong: '#93000a',
  dangerContainer: '#ffdad6',

  surfaceBackground: '#faf8ff',
  surfaceCard: '#ffffff',
  surfaceCode: '#283044',
  onSurfaceCode: '#eef0ff',

  contentPrimary: '#131b2e',
  contentSecondary: '#464555',
  contentMuted: '#777587',
  contentOnPrimary: '#ffffff',

  lineSubtle: '#eaedff',
  lineDefault: '#e2e7ff',

  overlay: 'rgba(19, 27, 46, 0.4)',
} as const;

/**
 * Spacing scale in points, from the `Kalibra/Spacing` variables.
 */
export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 20,
  xxxl: 24,
  gutter: 21.5,
  pageTop: 64,
  pageBottom: 96,
} as const;

/**
 * Corner radius scale in points.
 */
export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  full: 9999,
} as const;

/**
 * Font family of each weight; file names match the PostScript names so they work on iOS and Android.
 */
export const fonts = {
  regular: 'PlusJakartaSans-Regular',
  medium: 'PlusJakartaSans-Medium',
  semiBold: 'PlusJakartaSans-SemiBold',
  bold: 'PlusJakartaSans-Bold',
  icons: 'MaterialSymbolsRounded-Regular',
  mono: 'Menlo',
} as const;

/**
 * Text styles of the design system (`Kalibra/*` text styles).
 */
export const typography = {
  display: { fontFamily: fonts.bold, fontSize: 26, lineHeight: 32, letterSpacing: -0.65 },
  headlineL: { fontFamily: fonts.semiBold, fontSize: 20, lineHeight: 28, letterSpacing: -0.5 },
  headlineM: { fontFamily: fonts.semiBold, fontSize: 18, lineHeight: 24, letterSpacing: -0.45 },
  title: { fontFamily: fonts.semiBold, fontSize: 16, lineHeight: 22 },
  bodyL: { fontFamily: fonts.regular, fontSize: 14, lineHeight: 20 },
  labelL: { fontFamily: fonts.semiBold, fontSize: 14, lineHeight: 20, letterSpacing: 0.14 },
  bodyM: { fontFamily: fonts.regular, fontSize: 12, lineHeight: 16 },
  bodyMBold: { fontFamily: fonts.bold, fontSize: 12, lineHeight: 16, letterSpacing: 0.24 },
  labelM: { fontFamily: fonts.semiBold, fontSize: 10, lineHeight: 12, letterSpacing: 0.4 },
  labelS: { fontFamily: fonts.bold, fontSize: 10, lineHeight: 12, letterSpacing: 0.4 },
  code: { fontFamily: fonts.mono, fontSize: 13, lineHeight: 20 },
} satisfies Record<string, TextStyle>;

/**
 * Elevation styles (`Kalibra/Elevation *` effect styles).
 */
export const shadows = {
  card: { shadowColor: '#000000', shadowOpacity: 0.05, shadowRadius: 2, shadowOffset: { width: 0, height: 1 }, elevation: 1 },
  raised: { shadowColor: '#000000', shadowOpacity: 0.1, shadowRadius: 4, shadowOffset: { width: 0, height: 2 }, elevation: 3 },
  floating: { shadowColor: '#000000', shadowOpacity: 0.1, shadowRadius: 6, shadowOffset: { width: 0, height: 4 }, elevation: 6 },
  nav: { shadowColor: '#000000', shadowOpacity: 0.04, shadowRadius: 12, shadowOffset: { width: 0, height: -2 }, elevation: 8 },
} satisfies Record<string, ViewStyle>;

/**
 * Background gradients used by highlight cards.
 */
export const gradients = {
  primary: 'linear-gradient(159deg, #4f46e5 0%, #3525cd 50%, #3323cc 100%)',
  success: 'linear-gradient(146deg, #6cf8bb 0%, #f2f3ff 50%, #ffffff 100%)',
  danger: 'linear-gradient(146deg, #ffdad6 0%, #f2f3ff 50%, #ffffff 100%)',
  progress: 'linear-gradient(90deg, #4f46e5 0%, #3525cd 100%)',
} as const;

/**
 * Minimum touch target in points.
 */
export const TOUCH_TARGET = 44;
