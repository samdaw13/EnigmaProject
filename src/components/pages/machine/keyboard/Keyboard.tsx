import { useNavigation } from '@react-navigation/native';
import { FunctionComponent } from 'react';
import { Text, View } from 'react-native';
import { Button } from 'react-native-paper';

import { GO_BACK, KEYBOARD } from '../../../../constants';
import { NextScreenNavigationProp } from '../../../../types';

export const Keyboard: FunctionComponent = () => {
  const navigation = useNavigation<NextScreenNavigationProp>();

  const navigateToPreviousScreen = () => {
    navigation.goBack();
  };
  return (
    <View>
      <Text>{KEYBOARD}</Text>
      <Button onPress={navigateToPreviousScreen}>{GO_BACK}</Button>
    </View>
  );
};
