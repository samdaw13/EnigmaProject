import { NavigationProp, useNavigation } from '@react-navigation/native';
import { FunctionComponent } from 'react';
import { View } from 'react-native';
import { Button } from 'react-native-paper';

import { Plugboard } from './plugboard';
import { Rotors } from './rotors';

// Define your stack navigation param list
type StackParamList = {
  Keyboard: undefined;
};

// Define the type of the navigation prop
type NextScreenNavigationProp = NavigationProp<StackParamList, 'Keyboard'>;

export const Settings: FunctionComponent = () => {
  const navigation = useNavigation<NextScreenNavigationProp>();
  const navigateToNextItem = () => {
    navigation.navigate('Keyboard');
  };
  return (
    <View>
      <Rotors />
      <Plugboard />
      <Button onPress={navigateToNextItem}>Encrypt a message</Button>
    </View>
  );
};
