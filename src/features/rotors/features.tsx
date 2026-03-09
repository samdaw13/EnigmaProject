import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

import { ALPHABET } from '../../constants';
import type {
  RotorsState,
  SelectedRotorAction,
  UpdateRotorAvailabilityInterface,
  UpdateRotorCurrentIndexInterface,
} from '../../types';

export const initialRotorState: RotorsState = {
  available: {
    1: {
      isAvailable: true,
      config: {
        stepIndex: 16,
        displayedLetters: ALPHABET.split(''),
        mappedLetters: 'JGDQOXUSCAMIFRVTPNEWKBLZYH'.split(''),
        currentIndex: 0,
      },
      id: 1,
    },
    2: {
      isAvailable: true,
      config: {
        stepIndex: 4,
        displayedLetters: ALPHABET.split(''),
        mappedLetters: 'NTZPSFBOKMWRCJDIVLAEYUXHGQ'.split(''),
        currentIndex: 0,
      },
      id: 2,
    },
    3: {
      isAvailable: true,
      config: {
        stepIndex: 21,
        displayedLetters: ALPHABET.split(''),
        mappedLetters: 'JVIUBHTCDYAKEQZPOSGXNRMWFL'.split(''),
        currentIndex: 0,
      },
      id: 3,
    },
    4: {
      isAvailable: true,
      config: {
        stepIndex: 9,
        displayedLetters: ALPHABET.split(''),
        mappedLetters: 'QYHOGNECVPUZTFDJAXWMKISRBL'.split(''),
        currentIndex: 0,
      },
      id: 4,
    },
    5: {
      isAvailable: true,
      config: {
        stepIndex: 25,
        displayedLetters: ALPHABET.split(''),
        mappedLetters: 'QWERTZUIOASDFGHJKPYXCVBNML'.split(''),
        currentIndex: 0,
      },
      id: 5,
    },
  },
  selectedSlots: [null, null, null],
};

export const rotorsSlice = createSlice({
  name: 'rotors',
  initialState: initialRotorState,
  reducers: {
    updateRotorAvailability: (
      state,
      action: PayloadAction<UpdateRotorAvailabilityInterface>,
    ) => {
      state.available[action.payload.id]!.isAvailable =
        action.payload.isAvailable;
    },
    updateRotorCurrentIndex: (
      state,
      action: PayloadAction<UpdateRotorCurrentIndexInterface>,
    ) => {
      state.available[action.payload.id]!.config.currentIndex =
        action.payload.currentIndex;
    },
    setSelectedRotor: (state, action: PayloadAction<SelectedRotorAction>) => {
      state.selectedSlots[action.payload.slotIndex] = action.payload.rotorId;
    },
    clearSelectedRotor: (
      state,
      action: PayloadAction<{ slotIndex: number }>,
    ) => {
      state.selectedSlots[action.payload.slotIndex] = null;
    },
    resetRotors: () => initialRotorState,
  },
});

export const {
  updateRotorAvailability,
  updateRotorCurrentIndex,
  setSelectedRotor,
  clearSelectedRotor,
  resetRotors,
} = rotorsSlice.actions;

export default rotorsSlice.reducer;
