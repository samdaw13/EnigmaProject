import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { FunctionComponent } from 'react';

import { Settings } from './settings';
import { Keyboard } from './keyboard';
import { useNavigation } from '@react-navigation/native';

const Stack = createNativeStackNavigator();

export const Machine: FunctionComponent = () => {
  const {navigate} = useNavigation();
  return (
    <Stack.Navigator>
      <Stack.Screen
        name='Settings'
        component={Settings}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name='Keyboard'
        component={Keyboard}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};
