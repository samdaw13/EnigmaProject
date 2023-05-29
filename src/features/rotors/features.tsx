import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';

import {RotorsState, RotorState, UpdateRotorActionInterface} from '../../types';

const initialState: RotorsState = {
  rotors: [
    {
      isAvailable: true,
      config: {
        stepIndex: 2,
        displayedLetters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
        mappedLetters: 'JGDQOXUSCAMIFRVTPNEWKBLZYH'.split(''),
        currentIndex: 0,
      },
      id: 1,
    },
    {
      isAvailable: true,
      config: {
        stepIndex: 2,
        displayedLetters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
        mappedLetters: 'NTZPSFBOKMWRCJDIVLAEYUXHGQ'.split(''),
        currentIndex: 0,
      },
      id: 2,
    },
    {
      isAvailable: true,
      config: {
        stepIndex: 2,
        displayedLetters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
        mappedLetters: 'JVIUBHTCDYAKEQZPOSGXNRMWFL'.split(''),
        currentIndex: 0,
      },
      id: 3,
    },
    {
      isAvailable: true,
      config: {
        stepIndex: 2,
        displayedLetters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
        mappedLetters: 'QYHOGNECVPUZTFDJAXWMKISRBL'.split(''),
        currentIndex: 0,
      },
      id: 4,
    },
    {
      isAvailable: true,
      config: {
        stepIndex: 2,
        displayedLetters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
        mappedLetters: 'QWERTZUIOASDFGHJKPYXCVBNML'.split(''),
        currentIndex: 0,
      },
      id: 5,
    },
  ],
};

export const rotorsSlice = createSlice({
  name: 'rotors',
  initialState,
  reducers: {
    updateRotor: (state, action: PayloadAction<UpdateRotorActionInterface>) => {
      state.rotors.filter((rotor: RotorState) => {
        if (rotor.id === action.payload.id) {
          rotor.isAvailable = action.payload.isAvailable ?? rotor.isAvailable;
          rotor.config.currentIndex =
            action.payload.currentIndex ?? rotor.config.currentIndex;
          state.rotors = [...state.rotors];
        }
      });
      return state;
    },
  },
});

// Action creators are generated for each case reducer function
export const {updateRotor} = rotorsSlice.actions;

export default rotorsSlice.reducer;
