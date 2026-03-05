import type { FunctionComponent } from 'react';
import React, { useMemo } from 'react';
import { View } from 'react-native';

import { makeRotorStyles } from '../../../../../styles';
import { useThemeColors } from '../../../../../theme/useThemeColors';
import { Rotor } from './Rotor';

export const Rotors: FunctionComponent = () => {
  const colors = useThemeColors();
  const rotorStyles = useMemo(() => makeRotorStyles(colors), [colors]);
  return (
    <View style={rotorStyles.container}>
      <Rotor slotIndex={0} />
      <Rotor slotIndex={1} />
      <Rotor slotIndex={2} />
    </View>
  );
};
