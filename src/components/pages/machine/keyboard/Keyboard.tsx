import { NavigationProp, useNavigation } from '@react-navigation/native';
import { FunctionComponent } from 'react';
import { Text, View } from 'react-native';
import { Button } from 'react-native-paper';

type StackParamList = {
  Keyboard: undefined;
};

type KeyboardScreenNavigationProp = NavigationProp<StackParamList, 'Keyboard'>;
export const Keyboard: FunctionComponent = () => {
  const navigation = useNavigation<KeyboardScreenNavigationProp>();

  const navigateToPreviousScreen = () => {
    navigation.goBack();
  };
  return (
    <View>
      <Text>Keyboard</Text>
      <Button onPress={navigateToPreviousScreen}>Go Back</Button>
    </View>
  );
};
