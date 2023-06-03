import React, { ReactElement } from 'react';
import { Provider } from 'react-redux';
import {
  render as rtlRender,
  RenderOptions,
} from '@testing-library/react-native';
import {
  configureStore,
  EmptyObject,
  EnhancedStore,
  PreloadedState,
} from '@reduxjs/toolkit';
import rotorsReducer from '../features/rotors/features';
import type { RootState } from '../store/store';
import { SafeAreaProvider } from 'react-native-safe-area-context';

type ReducerTypes = Pick<RootState, 'rotors'>;
type TStore = EnhancedStore<ReducerTypes>;

type CustomRenderOptions = {
  preloadedState?: PreloadedState<ReducerTypes & EmptyObject>;
  store?: TStore;
} & Omit<RenderOptions, 'wrapper'>;

function render(ui: ReactElement, options?: CustomRenderOptions) {
  const { preloadedState } = options || {
    preloadedState: {
      rotors: {
        rotors: [
          {
            isAvailable: false,
            config: {
              stepIndex: 1,
              displayedLetters: ['A', 'B', 'C'],
              mappedLetters: ['D', 'E', 'F'],
              currentIndex: 0,
            },
            id: 1,
          },
          {
            isAvailable: false,
            config: {
              stepIndex: 2,
              displayedLetters: ['D', 'E', 'F'],
              mappedLetters: ['G', 'H', 'I'],
              currentIndex: 0,
            },
            id: 2,
          },
        ],
      },
    },
  };
  const store =
    options?.store ||
    configureStore({
      reducer: {
        rotors: rotorsReducer,
      },
      preloadedState,
    });

  function Wrapper({ children }: { children: React.ReactNode }) {
    const inset = {
      frame: { x: 0, y: 0, width: 0, height: 0 },
      insets: { top: 0, left: 0, right: 0, bottom: 0 },
    };
    return (
      <SafeAreaProvider initialMetrics={inset}>
        <Provider store={store}>{children}</Provider>
      </SafeAreaProvider>
    );
  }

  return rtlRender(ui, { wrapper: Wrapper, ...options });
}

// re-export everything
export * from '@testing-library/react-native';
// override render method
export { render };
