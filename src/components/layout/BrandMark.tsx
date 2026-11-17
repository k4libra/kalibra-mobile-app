import React, { useId } from 'react';
import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg';
/** Exact approved calibration mark, scaled from its 48-point SVG. */
export function BrandMark({ size = 36 }: { size?: number }) {
  const gradient = `brand-${useId()}`;
  return <Svg width={size} height={size} viewBox="0 0 48 48" accessibilityLabel="Kalibra">
    <Defs><LinearGradient id={gradient} x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse"><Stop stopColor="#6366F1" /><Stop offset="1" stopColor="#3525CD" /></LinearGradient></Defs>
    <Path d="M34 0H14C6.26801 0 0 6.26801 0 14V34C0 41.732 6.26801 48 14 48H34C41.732 48 48 41.732 48 34V14C48 6.26801 41.732 0 34 0Z" fill={`url(#${gradient})`} />
    <Path d="M37.3 18.8C38.6759 23.9186 37.9637 29.374 35.3199 33.9678C32.6761 38.5616 28.3169 41.9181 23.2 43.3" strokeWidth="2.5" strokeLinecap="round" stroke="white" strokeOpacity="0.32" />
    <Path d="M35.3 34C33.5474 37.0303 31.0303 39.5474 28 41.3" strokeWidth="3" strokeLinecap="round" stroke="#4EDEA3" />
    <Path d="M17.5 12.75C17.5 11.2312 16.2688 10 14.75 10C13.2312 10 12 11.2312 12 12.75V35.25C12 36.7688 13.2312 38 14.75 38C16.2688 38 17.5 36.7688 17.5 35.25V12.75Z" fill="white" />
    <Path d="M18 23.5L31 10.5" strokeWidth="5.5" strokeLinecap="round" stroke="white" />
    <Path d="M18.5 24.5L28.3 34.3" strokeWidth="5" strokeLinecap="round" stroke="#4EDEA3" />
  </Svg>;
}
