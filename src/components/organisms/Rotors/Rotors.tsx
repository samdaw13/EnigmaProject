import type { FunctionComponent } from 'react';
import React, { useMemo } from 'react';
import { View } from 'react-native';

import { useThemeColors } from '../../../theme/useThemeColors';
import { Rotor } from '../Rotor';
import { makeStyles } from './styles';

export const Rotors: FunctionComponent = () => {
  const colors = useThemeColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  return (
    <View style={styles.container}>
      <Rotor slotIndex={0} />
      <Rotor slotIndex={1} />
      <Rotor slotIndex={2} />
    </View>
  );
};
