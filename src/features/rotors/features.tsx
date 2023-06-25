import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

import {
  RotorsState,
  UpdateRotorAvailabilityInterface,
  UpdateRotorCurrentIndexInterface,
} from '../../types';

const initialState: RotorsState = {
  1: {
    isAvailable: true,
    config: {
      stepIndex: 2,
      displayedLetters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
      mappedLetters: 'JGDQOXUSCAMIFRVTPNEWKBLZYH'.split(''),
      currentIndex: 0,
    },
    id: 1,
  },
  2: {
    isAvailable: true,
    config: {
      stepIndex: 2,
      displayedLetters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
      mappedLetters: 'NTZPSFBOKMWRCJDIVLAEYUXHGQ'.split(''),
      currentIndex: 0,
    },
    id: 2,
  },
  3: {
    isAvailable: true,
    config: {
      stepIndex: 2,
      displayedLetters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
      mappedLetters: 'JVIUBHTCDYAKEQZPOSGXNRMWFL'.split(''),
      currentIndex: 0,
    },
    id: 3,
  },
  4: {
    isAvailable: true,
    config: {
      stepIndex: 2,
      displayedLetters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
      mappedLetters: 'QYHOGNECVPUZTFDJAXWMKISRBL'.split(''),
      currentIndex: 0,
    },
    id: 4,
  },
  5: {
    isAvailable: true,
    config: {
      stepIndex: 2,
      displayedLetters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
      mappedLetters: 'QWERTZUIOASDFGHJKPYXCVBNML'.split(''),
      currentIndex: 0,
    },
    id: 5,
  },
};

export const rotorsSlice = createSlice({
  name: 'rotors',
  initialState,
  reducers: {
    updateRotorAvailability: (
      state,
      action: PayloadAction<UpdateRotorAvailabilityInterface>,
    ) => {
      state[action.payload.id].isAvailable = action.payload.isAvailable;
    },
    updateRotorCurrentIndex: (
      state,
      action: PayloadAction<UpdateRotorCurrentIndexInterface>,
    ) => {
      state[action.payload.id].config.currentIndex =
        action.payload.currentIndex;
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateRotorAvailability, updateRotorCurrentIndex } =
  rotorsSlice.actions;

export default rotorsSlice.reducer;
