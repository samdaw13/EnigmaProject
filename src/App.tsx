import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import type { FunctionComponent } from 'react';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';

import { About, BreakCipher, Machine, Settings } from './components';
import {
  CANCEL_LABEL,
  SEARCH_RUNNING_BACKGROUND_LABEL,
} from './constants/labels';
import {
  SEARCH_BANNER,
  SEARCH_BANNER_CANCEL_BUTTON,
} from './constants/selectors';
import { searchCancelled } from './features/codeBreaking';
import { cancelSearch } from './features/codeBreaking/searchRunner';
import { loadSettings } from './features/settings';
import type { AppDispatch, RootState } from './store/store';
import { getColors } from './theme/colors';
import { useResolvedTheme } from './theme/useResolvedTheme';
import { useThemeColors } from './theme/useThemeColors';

const Drawer = createDrawerNavigator();

const bannerStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderTopWidth: 1,
  },
  label: {
    fontSize: 13,
    flex: 1,
  },
});

const SearchBanner: FunctionComponent<{ currentRoute: string | null }> = ({
  currentRoute,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const searchStatus = useSelector(
    (state: RootState) => state.codeBreaking.status,
  );
  const progress = useSelector(
    (state: RootState) => state.codeBreaking.progress,
  );
  const colors = useThemeColors();

  if (searchStatus !== 'searching' || currentRoute === 'Break') return null;

  const handleCancel = () => {
    cancelSearch();
    dispatch(searchCancelled());
  };

  const pct = Math.round(progress * 100);

  return (
    <View
      testID={SEARCH_BANNER}
      style={[
        bannerStyles.container,
        {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
      ]}
    >
      <Text style={[bannerStyles.label, { color: colors.textPrimary }]}>
        {SEARCH_RUNNING_BACKGROUND_LABEL} — {pct}%
      </Text>
      <Button
        testID={SEARCH_BANNER_CANCEL_BUTTON}
        mode='text'
        compact
        onPress={handleCancel}
        textColor={colors.textSecondary}
      >
        {CANCEL_LABEL}
      </Button>
    </View>
  );
};

const App: FunctionComponent = () => {
  const dispatch = useDispatch<AppDispatch>();
  const resolvedTheme = useResolvedTheme();
  const colors = getColors(resolvedTheme);
  const [currentRoute, setCurrentRoute] = useState<string | null>(null);

  useEffect(() => {
    void dispatch(loadSettings());
  }, [dispatch]);

  return (
    <NavigationContainer
      onStateChange={(state) => {
        setCurrentRoute(state?.routes[state.index]?.name ?? null);
      }}
    >
      <Drawer.Navigator
        initialRouteName='Enigma'
        screenOptions={{
          drawerStyle: { backgroundColor: colors.background },
          drawerActiveTintColor: colors.accent,
          drawerInactiveTintColor: colors.textPrimary,
          drawerItemStyle: { marginVertical: 4 },
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
      <SearchBanner currentRoute={currentRoute} />
    </NavigationContainer>
  );
};

export default App;
