import type {
  PlugboardCable,
  ReflectorState,
  RotorState,
} from '../types/interfaces';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const findDirectCableMapping = (
  letter: string,
  cables: PlugboardCable,
): string | undefined => cables[letter];

const findReverseCableMapping = (
  letter: string,
  cables: PlugboardCable,
): string | undefined => {
  for (const key in cables) {
    if (cables[key] === letter) {
      return key;
    }
  }
  return undefined;
};

export const passThroughPlugboard = (
  letter: string,
  cables: PlugboardCable,
): string =>
  findDirectCableMapping(letter, cables) ??
  findReverseCableMapping(letter, cables) ??
  letter;

const applyOffset = (index: number, offset: number, size: number): number =>
  (index + offset) % size;

const removeOffset = (index: number, offset: number, size: number): number =>
  (index - offset + size) % size;

const forwardPassThroughRotor = (letter: string, rotor: RotorState): string => {
  const { mappedLetters, currentIndex } = rotor.config;
  const size = mappedLetters.length;

  const shiftedIndex = applyOffset(
    ALPHABET.indexOf(letter),
    currentIndex,
    size,
  );
  const outputLetter = mappedLetters[shiftedIndex]!;
  const adjustedIndex = removeOffset(
    ALPHABET.indexOf(outputLetter),
    currentIndex,
    size,
  );
  return ALPHABET[adjustedIndex]!;
};

const reversePassThroughRotor = (letter: string, rotor: RotorState): string => {
  const { mappedLetters, currentIndex } = rotor.config;
  const size = mappedLetters.length;

  const shiftedIndex = applyOffset(
    ALPHABET.indexOf(letter),
    currentIndex,
    size,
  );
  const letterAtShifted = ALPHABET[shiftedIndex]!;
  const mappedIndex = mappedLetters.indexOf(letterAtShifted);
  const adjustedIndex = removeOffset(mappedIndex, currentIndex, size);
  return ALPHABET[adjustedIndex]!;
};

export const passThroughRotor = (
  letter: string,
  rotor: RotorState,
  reverse: boolean,
): string =>
  reverse
    ? reversePassThroughRotor(letter, rotor)
    : forwardPassThroughRotor(letter, rotor);

export const passThroughReflector = (
  letter: string,
  reflector: ReflectorState,
): string => {
  const index = ALPHABET.indexOf(letter);
  return reflector.config.mapping[index]!;
};

const advanceRotor = (rotor: RotorState): RotorState => ({
  ...rotor,
  config: {
    ...rotor.config,
    currentIndex: (rotor.config.currentIndex + 1) % 26,
  },
});

const isAtNotch = (rotor: RotorState): boolean =>
  rotor.config.currentIndex === rotor.config.stepIndex;

export const stepRotors = (rotors: RotorState[]): RotorState[] => {
  const [right, middle, left] = rotors as [RotorState, RotorState, RotorState];

  if (isAtNotch(middle)) {
    return [advanceRotor(right), advanceRotor(middle), advanceRotor(left)];
  }

  if (isAtNotch(right)) {
    return [advanceRotor(right), advanceRotor(middle), left];
  }

  return [advanceRotor(right), middle, left];
};

const passForwardThroughRotors = (
  signal: string,
  rotors: RotorState[],
): string =>
  rotors.reduce((s, rotor) => passThroughRotor(s, rotor, false), signal);

const passReverseThroughRotors = (
  signal: string,
  rotors: RotorState[],
): string =>
  [...rotors]
    .reverse()
    .reduce((s, rotor) => passThroughRotor(s, rotor, true), signal);

export const encryptLetter = (
  letter: string,
  rotors: RotorState[],
  plugboard: PlugboardCable,
  reflector: ReflectorState,
): string => {
  let signal = passThroughPlugboard(letter, plugboard);
  signal = passForwardThroughRotors(signal, rotors);
  signal = passThroughReflector(signal, reflector);
  signal = passReverseThroughRotors(signal, rotors);
  signal = passThroughPlugboard(signal, plugboard);
  return signal;
};
