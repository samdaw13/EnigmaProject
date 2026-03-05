import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import React, { FunctionComponent, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { About, BreakCipher, Machine, Settings } from './components';
import { loadSettings } from './features/settings';
import type { AppDispatch } from './store/store';
import { colors } from './theme/colors';

const App: FunctionComponent = () => {
  const dispatch = useDispatch<AppDispatch>();
  const Drawer = createDrawerNavigator();

  useEffect(() => {
    void dispatch(loadSettings());
  }, [dispatch]);

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
