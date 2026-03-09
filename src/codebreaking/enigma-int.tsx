import type { ReflectorState, RotorState } from '../types/interfaces';

export const ALPHABET_SIZE = 26;
const ASCII_A = 65;

// Lookup table replacing `% 26` for values in [0, 51].
const MOD26 = new Uint8Array(52);
for (let i = 0; i < 52; i++) MOD26[i] = i % 26;

export const letterToIndex = (char: string): number =>
  char.charCodeAt(0) - ASCII_A;

export const indexToLetter = (index: number): string =>
  String.fromCharCode(index + ASCII_A);

export interface RotorIntTables {
  fwd: Uint8Array;
  inv: Uint8Array;
}

export const buildRotorIntTables = (rotor: RotorState): RotorIntTables => {
  const fwd = new Uint8Array(ALPHABET_SIZE);
  const inv = new Uint8Array(ALPHABET_SIZE);
  for (let i = 0; i < ALPHABET_SIZE; i++) {
    const fi = letterToIndex(rotor.config.mappedLetters[i]!);
    fwd[i] = fi;
    inv[fi] = i;
  }
  return { fwd, inv };
};

export const buildReflectorIntMap = (reflector: ReflectorState): Uint8Array => {
  const m = new Uint8Array(ALPHABET_SIZE);
  for (let i = 0; i < ALPHABET_SIZE; i++) {
    m[i] = letterToIndex(reflector.config.mapping[i]!);
  }
  return m;
};

export const stringToIndexArray = (s: string): Uint8Array => {
  const codes = new Uint8Array(s.length);
  for (let i = 0; i < s.length; i++) {
    codes[i] = letterToIndex(s[i]!);
  }
  return codes;
};

// Integer rotor stepping — mirrors stepRotors() without object allocation.
export const intStepRotors = (
  r: number,
  m: number,
  l: number,
  rStep: number,
  mStep: number,
  out: Uint8Array,
): void => {
  if (m === mStep) {
    out[0] = MOD26[r + 1]!;
    out[1] = MOD26[m + 1]!;
    out[2] = MOD26[l + 1]!;
  } else if (r === rStep) {
    out[0] = MOD26[r + 1]!;
    out[1] = MOD26[m + 1]!;
    out[2] = l;
  } else {
    out[0] = MOD26[r + 1]!;
    out[1] = m;
    out[2] = l;
  }
};

export const rotorPassForward = (
  fwd: Uint8Array,
  x: number,
  offset: number,
): number => MOD26[fwd[MOD26[x + offset]!]! - offset + ALPHABET_SIZE]!;

export const rotorPassInverse = (
  inv: Uint8Array,
  x: number,
  offset: number,
): number => MOD26[inv[MOD26[x + offset]!]! - offset + ALPHABET_SIZE]!;

export const computeScramblerEntry = (
  j: number,
  ro: number,
  mo: number,
  lo: number,
  rFwd: Uint8Array,
  mFwd: Uint8Array,
  lFwd: Uint8Array,
  rInv: Uint8Array,
  mInv: Uint8Array,
  lInv: Uint8Array,
  reflMap: Uint8Array,
): number => {
  let x = rotorPassForward(rFwd, j, ro);
  x = rotorPassForward(mFwd, x, mo);
  x = rotorPassForward(lFwd, x, lo);
  x = reflMap[x]!;
  x = rotorPassInverse(lInv, x, lo);
  x = rotorPassInverse(mInv, x, mo);
  return rotorPassInverse(rInv, x, ro);
};
