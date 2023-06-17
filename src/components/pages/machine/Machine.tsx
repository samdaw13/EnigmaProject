import { FunctionComponent } from 'react';

import { View, Text } from 'react-native';
import { Rotors } from './rotors';
import { Plugboard } from './plugboard';

export const Machine: FunctionComponent = () => {
  return (
    <View>
      <Rotors />
      <Plugboard />
      <Text>Enigma machine</Text>
    </View>
  );
};
