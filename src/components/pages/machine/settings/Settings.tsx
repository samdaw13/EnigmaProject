import { FunctionComponent } from 'react';
import { View } from 'react-native';
import { Button } from 'react-native-paper';

import { Plugboard } from './plugboard';
import { Rotors } from './rotors';

export const Settings: FunctionComponent = () => {
  return (
    <View>
      <Rotors />
      <Plugboard />
      <Button>Encrypt a message</Button>
    </View>
  );
};
