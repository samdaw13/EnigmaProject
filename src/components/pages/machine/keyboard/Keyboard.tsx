import { useNavigation } from '@react-navigation/native';
import React, { FunctionComponent } from 'react';
import { Text, View } from 'react-native';
import { Button } from 'react-native-paper';

import {
  GO_BACK,
  KEYBOARD,
  KEYBOARD_GO_BACK_BUTTON,
} from '../../../../constants';
import { NextScreenNavigationProp } from '../../../../types';

export const Keyboard: FunctionComponent = () => {
  const navigation = useNavigation<NextScreenNavigationProp>();

  const navigateToPreviousScreen = () => {
    navigation.goBack();
  };
  return (
    <View>
      <Text>{KEYBOARD}</Text>
      <Button
        onPress={navigateToPreviousScreen}
        testID={KEYBOARD_GO_BACK_BUTTON}
      >
        {GO_BACK}
      </Button>
    </View>
  );
};
