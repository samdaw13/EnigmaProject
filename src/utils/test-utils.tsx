import type { EnhancedStore } from '@reduxjs/toolkit';
import { configureStore } from '@reduxjs/toolkit';
import type { RenderOptions } from '@testing-library/react-native';
import { render as rtlRender } from '@testing-library/react-native';
import type { ReactElement } from 'react';
import React from 'react';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';

import codeBreakingReducer from '../features/codeBreaking';
import plugboardReducer from '../features/plugboard';
import reflectorReducer from '../features/reflector';
import rotorsReducer from '../features/rotors/features';
import settingsReducer from '../features/settings';
import type { RootState } from '../store/store';
import type { RotorState } from '../types';

type ReducerTypes = Pick<RootState, 'rotors' | 'reflector' | 'plugboard'> &
  Partial<Pick<RootState, 'settings' | 'codeBreaking'>>;
type TStore = EnhancedStore<ReducerTypes>;

type CustomRenderOptions = {
  preloadedState?: ReducerTypes;
  store?: TStore;
} & Omit<RenderOptions, 'wrapper'>;

export const ROTOR_1: RotorState = {
  isAvailable: true,
  config: {
    stepIndex: 1,
    displayedLetters: ['A', 'B', 'C'],
    mappedLetters: ['D', 'E', 'F'],
    currentIndex: 0,
  },
  id: 1,
};

export const ROTOR_2: RotorState = {
  isAvailable: true,
  config: {
    stepIndex: 2,
    displayedLetters: ['D', 'E', 'F'],
    mappedLetters: ['G', 'H', 'I'],
    currentIndex: 0,
  },
  id: 2,
};

async function render(ui: ReactElement, options?: CustomRenderOptions) {
  const { preloadedState } = options || {
    preloadedState: {
      rotors: {
        available: {
          1: ROTOR_1,
          2: ROTOR_2,
        },
        selectedSlots: [null, null, null],
      },
      plugboard: {},
    },
  };
  const store =
    options?.store ||
    configureStore({
      reducer: {
        rotors: rotorsReducer,
        plugboard: plugboardReducer,
        reflector: reflectorReducer,
        settings: settingsReducer,
        codeBreaking: codeBreakingReducer,
      },
      ...(preloadedState !== undefined ? { preloadedState } : {}),
    });

  function Wrapper({ children }: { children: React.ReactNode }) {
    const inset = {
      frame: { x: 0, y: 0, width: 0, height: 0 },
      insets: { top: 0, left: 0, right: 0, bottom: 0 },
    };
    return (
      <SafeAreaProvider initialMetrics={inset}>
        <Provider store={store}>
          <PaperProvider>{children}</PaperProvider>
        </Provider>
      </SafeAreaProvider>
    );
  }

  const { preloadedState: _ps, store: _s, ...rtlOptions } = options || {};
  return await rtlRender(ui, { wrapper: Wrapper, ...rtlOptions });
}

// re-export everything
export * from '@testing-library/react-native';
// override render method
export { render };
