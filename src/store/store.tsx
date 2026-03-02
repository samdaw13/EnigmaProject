import { configureStore } from '@reduxjs/toolkit';

import plugboardReducer from '../features/plugboard';
import reflectorReducer from '../features/reflector';
import rotorsReducer from '../features/rotors/features';

export const store = configureStore({
  reducer: {
    rotors: rotorsReducer,
    plugboard: plugboardReducer,
    reflector: reflectorReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
