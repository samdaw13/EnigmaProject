import { useNavigation } from '@react-navigation/native';
import React, { FunctionComponent } from 'react';
import { View } from 'react-native';
import { Button } from 'react-native-paper';

import { ENCRYPT_MESSAGE, ENCRYPT_MESSAGE_BUTTON } from '../../../../constants';
import { NextScreenNavigationProp } from '../../../../types';
import { Plugboard } from './plugboard';
import { Rotors } from './rotors';

export const Settings: FunctionComponent = () => {
  const navigation = useNavigation<NextScreenNavigationProp>();
  const navigateToNextItem = () => {
    navigation.navigate('Keyboard');
  };
  return (
    <View>
      <Rotors />
      <Plugboard />
      <Button onPress={navigateToNextItem} testID={ENCRYPT_MESSAGE_BUTTON}>
        {ENCRYPT_MESSAGE}
      </Button>
    </View>
  );
};
