import AsyncStorage from '@react-native-async-storage/async-storage';
import { configureStore } from '@reduxjs/toolkit';

import reducer, { loadSettings, persistSettings, setTheme } from './index';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

describe('settings reducer', () => {
  it('returns the initial state', () => {
    const state = reducer(undefined, { type: 'unknown' });
    expect(state.theme).toBe('system');
  });

  it('setTheme updates the theme', () => {
    const state = reducer(undefined, setTheme('light'));
    expect(state.theme).toBe('light');
  });

  describe('loadSettings', () => {
    it('loads stored settings from AsyncStorage', async () => {
      jest
        .spyOn(AsyncStorage, 'getItem')
        .mockResolvedValueOnce(JSON.stringify({ theme: 'light' }));
      const store = configureStore({ reducer: { settings: reducer } });
      await store.dispatch(loadSettings());
      expect(store.getState().settings.theme).toBe('light');
    });

    it('uses initial state when no stored settings', async () => {
      jest.spyOn(AsyncStorage, 'getItem').mockResolvedValueOnce(null);
      const store = configureStore({ reducer: { settings: reducer } });
      await store.dispatch(loadSettings());
      expect(store.getState().settings.theme).toBe('system');
    });
  });

  describe('persistSettings', () => {
    it('saves current settings to AsyncStorage', async () => {
      const setItemSpy = jest
        .spyOn(AsyncStorage, 'setItem')
        .mockResolvedValueOnce(undefined);
      const store = configureStore({ reducer: { settings: reducer } });
      store.dispatch(setTheme('light'));
      await store.dispatch(persistSettings() as never);
      expect(setItemSpy).toHaveBeenCalledWith(
        '@enigma_settings',
        JSON.stringify({ theme: 'light' }),
      );
    });
  });
});
