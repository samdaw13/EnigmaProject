import { configureStore } from '@reduxjs/toolkit';

import codeBreakingReducer from '../features/codeBreaking';
import plugboardReducer from '../features/plugboard';
import reflectorReducer from '../features/reflector';
import rotorsReducer from '../features/rotors/features';
import settingsReducer from '../features/settings';

export const store = configureStore({
  reducer: {
    rotors: rotorsReducer,
    plugboard: plugboardReducer,
    reflector: reflectorReducer,
    settings: settingsReducer,
    codeBreaking: codeBreakingReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
