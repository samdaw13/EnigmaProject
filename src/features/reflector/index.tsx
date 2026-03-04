import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

import { ReflectorsState, UpdateSelectedReflectorInterface } from '../../types';

export const initialReflectorState: ReflectorsState = {
  reflectors: {
    1: {
      id: 1,
      name: 'UKW-A',
      config: {
        mapping: 'EJMZALYXVBWFCRQUONTSPIKHGD'.split(''),
      },
    },
    2: {
      id: 2,
      name: 'UKW-B',
      config: {
        mapping: 'YRUHQSLDPXNGOKMIEBFZCWVJAT'.split(''),
      },
    },
    3: {
      id: 3,
      name: 'UKW-C',
      config: {
        mapping: 'FVPJIAOYEDRZXWGCTKUQSBNMHL'.split(''),
      },
    },
  },
  selectedReflectorId: 2,
};

export const reflectorSlice = createSlice({
  name: 'reflector',
  initialState: initialReflectorState,
  reducers: {
    selectReflector: (
      state,
      action: PayloadAction<UpdateSelectedReflectorInterface>,
    ) => {
      state.selectedReflectorId = action.payload.id;
    },
  },
});

// Action creators are generated for each case reducer function
export const { selectReflector } = reflectorSlice.actions;

export default reflectorSlice.reducer;
