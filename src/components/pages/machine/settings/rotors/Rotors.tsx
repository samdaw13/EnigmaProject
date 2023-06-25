import React, { FunctionComponent } from 'react';
import { View } from 'react-native';

import { rotorStyles } from '../../../../../styles';
import { Rotor } from './Rotor';

export const Rotors: FunctionComponent = () => {
  return (
    <View style={rotorStyles.container}>
      <Rotor />
      <Rotor />
      <Rotor />
    </View>
  );
};
