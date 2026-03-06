import * as React from 'react';
import { AppRegistry } from 'react-native';
import { DefaultTheme, PaperProvider } from 'react-native-paper';
import { name as appName } from './app.json';
import App from './src/App';
import { Provider } from 'react-redux';
import { store } from './src/store/store';
import { darkColors as colors } from './src/theme/colors';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.accent,
    onPrimary: colors.background,
    primaryContainer: colors.surfaceAlt,
    onPrimaryContainer: colors.textPrimary,
    secondary: colors.accent,
    onSecondary: colors.background,
    secondaryContainer: colors.surfaceAlt,
    onSecondaryContainer: colors.textPrimary,
    background: colors.background,
    onBackground: colors.textPrimary,
    surface: colors.surface,
    onSurface: colors.textPrimary,
    surfaceVariant: colors.surfaceAlt,
    onSurfaceVariant: colors.textSecondary,
    outline: colors.border,
    outlineVariant: colors.border,
    inverseSurface: colors.textPrimary,
    inverseOnSurface: colors.background,
    inversePrimary: colors.accent,
    elevation: {
      level0: 'transparent',
      level1: colors.surface,
      level2: colors.surface,
      level3: colors.surfaceAlt,
      level4: colors.surfaceAlt,
      level5: colors.surfaceAlt,
    },
    surfaceDisabled: 'rgba(245, 240, 232, 0.12)',
    onSurfaceDisabled: 'rgba(245, 240, 232, 0.38)',
    backdrop: 'rgba(0, 0, 0, 0.6)',
  },
};

export default function Main() {
  return (
    <Provider store={ store }>
      <PaperProvider theme={theme}>
        <App />
      </PaperProvider>
    </Provider>
  );
}

AppRegistry.registerComponent(appName, () => Main);
