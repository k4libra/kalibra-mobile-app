import React, { useId } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Defs, Ellipse, FeGaussianBlur, Filter, G } from 'react-native-svg';
/** Approved SVG ellipses and 40-point blur, fitted to the mobile glow instance. */
export function BackgroundGlow() {
  const id = useId();
  return <View pointerEvents="none" accessible={false} style={styles.glow}>
    <Svg width="100%" height="320" viewBox="0 0 680 480" preserveAspectRatio="none">
      <Defs><Filter id={`${id}-lavender`} x="0" y="0" width="480" height="400" filterUnits="userSpaceOnUse"><FeGaussianBlur stdDeviation="40" /></Filter>
        <Filter id={`${id}-mint`} x="280" y="40" width="400" height="360" filterUnits="userSpaceOnUse"><FeGaussianBlur stdDeviation="40" /></Filter></Defs>
      <G opacity="0.7" filter={`url(#${id}-lavender)`}><Ellipse cx="240" cy="200" rx="160" ry="120" fill="#E2DFFF" /></G>
      <G opacity="0.8" filter={`url(#${id}-mint)`}><Ellipse cx="480" cy="220" rx="120" ry="100" fill="#DDFBEE" /></G>
    </Svg>
  </View>;
}
const styles = StyleSheet.create({ glow: { position: 'absolute', top: 0, left: 0, right: 0, height: 320 } });
