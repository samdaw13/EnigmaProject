import { createDrawerNavigator } from '@react-navigation/drawer';
import type { LinkingOptions } from '@react-navigation/native';
import { NavigationContainer } from '@react-navigation/native';
import type { FunctionComponent } from 'react';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';

import {
  About,
  AppSettings,
  BreakCipher,
  Machine,
  SavedAnalyses,
  SavedMessages,
} from './components';
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

type RootStackParamList = {
  Enigma: undefined;
  Break: undefined;
  SavedMessages: undefined;
  SavedAnalyses: undefined;
  About: undefined;
  Settings: undefined;
};

const Drawer = createDrawerNavigator<RootStackParamList>();

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['enigma://'],
  config: {
    screens: {
      Break: 'search',
    },
  },
};

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
    <SafeAreaView
      edges={['bottom']}
      style={{ backgroundColor: colors.surface }}
    >
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
    </SafeAreaView>
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
      linking={linking}
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
          name='SavedMessages'
          component={SavedMessages}
          options={{ title: 'Saved messages' }}
        />
        <Drawer.Screen
          name='SavedAnalyses'
          component={SavedAnalyses}
          options={{ title: 'Saved analyses' }}
        />
        <Drawer.Screen
          name='About'
          component={About}
          options={{ title: 'About Enigma' }}
        />
        <Drawer.Screen
          name='Settings'
          component={AppSettings}
          options={{ title: 'Settings' }}
        />
      </Drawer.Navigator>
      <SearchBanner currentRoute={currentRoute} />
    </NavigationContainer>
  );
};

export default App;
