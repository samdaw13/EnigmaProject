import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import type { FunctionComponent } from 'react';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { About, BreakCipher, Machine, Settings } from './components';
import { loadSettings } from './features/settings';
import type { AppDispatch, RootState } from './store/store';
import { getColors } from './theme/colors';

const App: FunctionComponent = () => {
  const dispatch = useDispatch<AppDispatch>();
  const Drawer = createDrawerNavigator();
  const theme = useSelector((state: RootState) => state.settings.theme);
  const colors = getColors(theme);

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
