import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

import { PlugboardActionInterface, PlugboardCable } from '../../types';

const initialState: PlugboardCable = {};

export const plugboardSlice = createSlice({
  name: 'plugboard',
  initialState,
  reducers: {
    addCable: (state, action: PayloadAction<PlugboardActionInterface>) => {
      state[action.payload.inputLetter] = action.payload.outputLetter;
    },
    removeCable: (state, action: PayloadAction<PlugboardActionInterface>) => {
      delete state[action.payload.inputLetter];
    },
  },
});

// Action creators are generated for each case reducer function
export const { addCable, removeCable } = plugboardSlice.actions;

export default plugboardSlice.reducer;
