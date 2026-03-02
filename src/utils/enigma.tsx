import {
  PlugboardCable,
  ReflectorState,
  RotorState,
} from '../types/interfaces';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export const passThroughPlugboard = (
  letter: string,
  cables: PlugboardCable,
): string => {
  // Check if letter is a key in the cables
  if (cables[letter]) {
    return cables[letter];
  }
  // Check if letter is a value in the cables (bidirectional)
  for (const key in cables) {
    if (cables[key] === letter) {
      return key;
    }
  }
  return letter;
};

export const passThroughRotor = (
  letter: string,
  rotor: RotorState,
  reverse: boolean,
): string => {
  const { displayedLetters, mappedLetters, currentIndex } = rotor.config;
  const size = displayedLetters.length;

  // Get the index of the input letter in the alphabet
  const inputIndex = ALPHABET.indexOf(letter);

  // Apply the rotor's current position offset
  const shiftedIndex = (inputIndex + currentIndex) % size;

  if (!reverse) {
    // Forward: displayedLetters → mappedLetters
    const outputLetter = mappedLetters[shiftedIndex];
    // Remove the offset from the output
    const outputIndex = ALPHABET.indexOf(outputLetter);
    const adjustedIndex = (outputIndex - currentIndex + size) % size;
    return ALPHABET[adjustedIndex];
  } else {
    // Reverse: mappedLetters → displayedLetters
    const letterAtShifted = ALPHABET[shiftedIndex];
    const mappedIndex = mappedLetters.indexOf(letterAtShifted);
    const adjustedIndex = (mappedIndex - currentIndex + size) % size;
    return ALPHABET[adjustedIndex];
  }
};

export const passThroughReflector = (
  letter: string,
  reflector: ReflectorState,
): string => {
  const index = ALPHABET.indexOf(letter);
  return reflector.config.mapping[index];
};

export const encryptLetter = (
  letter: string,
  rotors: RotorState[],
  plugboard: PlugboardCable,
  reflector: ReflectorState,
): string => {
  // Signal path: plugboard → rotors forward (right to left) → reflector → rotors reverse (left to right) → plugboard
  let signal = passThroughPlugboard(letter, plugboard);

  // Forward pass through rotors (right to left: index 0 is rightmost)
  for (let i = 0; i < rotors.length; i++) {
    signal = passThroughRotor(signal, rotors[i], false);
  }

  // Through reflector
  signal = passThroughReflector(signal, reflector);

  // Reverse pass through rotors (left to right: last rotor first)
  for (let i = rotors.length - 1; i >= 0; i--) {
    signal = passThroughRotor(signal, rotors[i], true);
  }

  // Back through plugboard
  signal = passThroughPlugboard(signal, plugboard);

  return signal;
};
