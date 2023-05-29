import { configureStore } from '@reduxjs/toolkit';
import rotorsReducer from '../features/rotors/features';

export const store = configureStore({
  reducer: {
    rotors: rotorsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
