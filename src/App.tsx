import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import React, { FunctionComponent } from 'react';

import { About, BreakCipher, Machine, Settings } from './components';
import { colors } from './theme/colors';

const App: FunctionComponent = () => {
  const Drawer = createDrawerNavigator();
  return (
    <NavigationContainer>
      <Drawer.Navigator
        initialRouteName='Enigma'
        screenOptions={{
          drawerStyle: { backgroundColor: colors.background },
          drawerActiveTintColor: colors.accent,
          drawerInactiveTintColor: colors.textPrimary,
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.textPrimary,
        }}
      >
        <Drawer.Screen
          name='Enigma'
          component={Machine}
          options={{ title: 'Enigma machine' }}
        />
        <Drawer.Screen
          name='Break'
          component={BreakCipher}
          options={{ title: 'Break a cipher' }}
        />
        <Drawer.Screen
          name='About'
          component={About}
          options={{ title: 'About Enigma' }}
        />
        <Drawer.Screen
          name='Settings'
          component={Settings}
          options={{ title: 'Settings' }}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default App;
