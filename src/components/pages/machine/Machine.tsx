import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { FunctionComponent } from 'react';

import { Settings } from './settings';

const Stack = createNativeStackNavigator();

export const Machine: FunctionComponent = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name='Settings'
        component={Settings}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};
