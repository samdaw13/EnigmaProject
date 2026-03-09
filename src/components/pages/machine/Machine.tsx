import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { FunctionComponent } from 'react';
import React from 'react';

import { Keyboard } from '../../organisms/Keyboard';
import { MachineSettings } from '../MachineSettings';

const Stack = createNativeStackNavigator();

export const Machine: FunctionComponent = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name='Settings'
        component={MachineSettings}
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
