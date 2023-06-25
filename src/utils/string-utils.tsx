import { BUTTON, SET_ROTOR_BUTTON } from '../constants';

export const currentLetter = (letter: string): string =>
  `Current letter: ${letter}`;
export const currentRotor = (rotorId: number): string =>
  `Active rotor: ${rotorId}`;
export const selectRotorButton = (id: number): string =>
  `${SET_ROTOR_BUTTON}${id}`;
export const letterButton = (letter: string, rotorId: number): string =>
  `${BUTTON}${letter}${rotorId};`;
export const plugboardChipText = (input: string, output: string): string => `${input} -> ${output}`;
