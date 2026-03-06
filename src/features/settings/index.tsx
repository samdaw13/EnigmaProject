import AsyncStorage from '@react-native-async-storage/async-storage';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import type { SettingsState, Theme } from '../../types';

const SETTINGS_STORAGE_KEY = '@enigma_settings';

const initialState: SettingsState = {
  theme: 'system',
};

export const loadSettings = createAsyncThunk('settings/load', async () => {
  const stored = await AsyncStorage.getItem(SETTINGS_STORAGE_KEY);
  return stored !== null ? (JSON.parse(stored) as SettingsState) : initialState;
});

export const persistSettings =
  () => async (_: unknown, getState: () => unknown) => {
    const settings = (getState() as { settings: SettingsState }).settings;
    await AsyncStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  };

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.theme = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadSettings.fulfilled, (_, action) => action.payload);
  },
});

export const { setTheme } = settingsSlice.actions;

export default settingsSlice.reducer;
