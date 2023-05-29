import React, { FunctionComponent } from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { About, BreakCipher, Machine, Settings } from './components';

const App: FunctionComponent = () => {
  const Drawer = createDrawerNavigator();
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Enigma">
        <Drawer.Screen
          name="Enigma"
          component={Machine}
          options={{ title: 'Enigma machine' }}
        />
        <Drawer.Screen
          name="Break"
          component={BreakCipher}
          options={{ title: 'Break a cipher' }}
        />
        <Drawer.Screen
          name="About"
          component={About}
          options={{ title: 'About Enigma' }}
        />
        <Drawer.Screen
          name="Settings"
          component={Settings}
          options={{ title: 'Settings' }}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default App;
