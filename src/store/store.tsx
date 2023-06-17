import { configureStore } from '@reduxjs/toolkit';
import rotorsReducer from '../features/rotors/features';
import plugboardReducer from '../features/plugboard';

export const store = configureStore({
  reducer: {
    rotors: rotorsReducer,
    plugboard: plugboardReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
