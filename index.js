import * as React from 'react';
import { AppRegistry } from 'react-native';
import { DefaultTheme, PaperProvider } from 'react-native-paper';
import { name as appName } from './app.json';
import App from './src/App';
import { Provider } from 'react-redux';
import { store } from './src/store/store';

const theme = {
  ...DefaultTheme,
  
  
    "colors": {
      "primary": "rgb(52, 92, 168)",
      "onPrimary": "rgb(255, 255, 255)",
      "primaryContainer": "rgb(217, 226, 255)",
      "onPrimaryContainer": "rgb(0, 26, 67)",
      "secondary": "rgb(174, 44, 70)",
      "onSecondary": "rgb(255, 255, 255)",
      "secondaryContainer": "rgb(255, 218, 219)",
      "onSecondaryContainer": "rgb(64, 0, 15)",
      "tertiary": "rgb(0, 104, 116)",
      "onTertiary": "rgb(255, 255, 255)",
      "tertiaryContainer": "rgb(151, 240, 255)",
      "onTertiaryContainer": "rgb(0, 31, 36)",
      "error": "rgb(186, 26, 26)",
      "onError": "rgb(255, 255, 255)",
      "errorContainer": "rgb(255, 218, 214)",
      "onErrorContainer": "rgb(65, 0, 2)",
      "background": "rgb(254, 251, 255)",
      "onBackground": "rgb(27, 27, 31)",
      "surface": "rgb(254, 251, 255)",
      "onSurface": "rgb(27, 27, 31)",
      "surfaceVariant": "rgb(225, 226, 236)",
      "onSurfaceVariant": "rgb(68, 71, 79)",
      "outline": "rgb(117, 119, 128)",
      "outlineVariant": "rgb(197, 198, 208)",
      "shadow": "rgb(0, 0, 0)",
      "scrim": "rgb(0, 0, 0)",
      "inverseSurface": "rgb(48, 48, 52)",
      "inverseOnSurface": "rgb(242, 240, 244)",
      "inversePrimary": "rgb(175, 198, 255)",
      "elevation": {
        "level0": "transparent",
        "level1": "rgb(244, 243, 251)",
        "level2": "rgb(238, 238, 248)",
        "level3": "rgb(232, 234, 245)",
        "level4": "rgb(230, 232, 245)",
        "level5": "rgb(226, 229, 243)"
      },
      "surfaceDisabled": "rgba(27, 27, 31, 0.12)",
      "onSurfaceDisabled": "rgba(27, 27, 31, 0.38)",
      "backdrop": "rgba(46, 48, 56, 0.4)"
    }
  
  
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
