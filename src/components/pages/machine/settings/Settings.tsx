import { FunctionComponent } from 'react';

import { View } from 'react-native';
import { Rotors } from './rotors';
import { Plugboard } from './plugboard';
import { Button } from 'react-native-paper';

export const Settings: FunctionComponent = () => {
  return (
    <View>
      <Rotors />
      <Plugboard />
      <Button>Encrypt a message</Button>
    </View>
  );
};
