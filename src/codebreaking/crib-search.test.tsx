import { initialReflectorState } from '../features/reflector';
import { initialRotorState } from '../features/rotors/features';
import type {
  PlugboardCable,
  ReflectorState,
  RotorState,
} from '../types/interfaces';
import { encryptLetter, stepRotors } from '../utils/enigma';
import { buildMenuEdges, propagateMenuConstraints } from './crib-analysis';
import type { CribSearchResult } from './crib-search';
import { cribSearchAsync, encryptString } from './crib-search';

const rotorI: RotorState = initialRotorState.available[1]!;
const rotorII: RotorState = initialRotorState.available[2]!;
const rotorIII: RotorState = initialRotorState.available[3]!;

const reflectorB: ReflectorState = initialReflectorState.reflectors[2]!;
const emptyPlugboard: PlugboardCable = {};

// Limit rotors to III, II, I for faster crib search tests (6 perms vs 60)
const limitedRotors = {
  1: initialRotorState.available[1]!,
  2: initialRotorState.available[2]!,
  3: initialRotorState.available[3]!,
};

const buildScramblerTableAt = (
  rotors: RotorState[],
  steps: number,
): string[] => {
  const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let current = rotors;
  for (let i = 0; i < steps; i++) {
    current = stepRotors(current);
  }
  return ALPHABET.split('').map((letter) =>
    encryptLetter(letter, current, {}, reflectorB),
  );
};

describe('encryptString', () => {
  it('encrypts a string through the full signal path', () => {
    const rotors = [rotorIII, rotorII, rotorI];
    const result = encryptString('AAA', rotors, emptyPlugboard, reflectorB);
    expect(result).toHaveLength(3);
    expect(result).toMatch(/^[A-Z]+$/);
  });

  it('produces consistent output for same config', () => {
    const rotors = [rotorIII, rotorII, rotorI];
    const result1 = encryptString('HELLO', rotors, emptyPlugboard, reflectorB);
    const result2 = encryptString('HELLO', rotors, emptyPlugboard, reflectorB);
    expect(result1).toBe(result2);
  });

  it('decrypts back to original (Enigma symmetry)', () => {
    const rotors = [rotorIII, rotorII, rotorI];
    const encrypted = encryptString(
      'HELLO',
      rotors,
      emptyPlugboard,
      reflectorB,
    );
    const decrypted = encryptString(
      encrypted,
      rotors,
      emptyPlugboard,
      reflectorB,
    );
    expect(decrypted).toBe('HELLO');
  });

  it('no letter encrypts to itself', () => {
    const rotors = [rotorIII, rotorII, rotorI];
    const plaintext = 'AAAAAAAAAA';
    const result = encryptString(plaintext, rotors, emptyPlugboard, reflectorB);
    for (let i = 0; i < plaintext.length; i++) {
      expect(result[i]).not.toBe(plaintext[i]);
    }
  });
});

describe('cribSearchAsync', () => {
  it('finds a matching result with derived plugboard when crib is present', async () => {
    jest.useRealTimers();
    const plaintext = 'WITHTION';
    const crib = 'WITH';
    const rotors = [
      { ...rotorIII, config: { ...rotorIII.config, currentIndex: 0 } },
      { ...rotorII, config: { ...rotorII.config, currentIndex: 0 } },
      { ...rotorI, config: { ...rotorI.config, currentIndex: 0 } },
    ];
    const ciphertext = encryptString(
      plaintext,
      rotors,
      emptyPlugboard,
      reflectorB,
    );
    const segment = ciphertext.slice(0, crib.length);

    const results: CribSearchResult[] = await cribSearchAsync(
      ciphertext,
      crib,
      limitedRotors,
      { 2: initialReflectorState.reflectors[2]! },
      () => {},
    );

    expect(results.length).toBeGreaterThan(0);
    expect(results[0]!.derivedPlugboard).toBeDefined();
    expect(results[0]!.cribPosition).toBeGreaterThanOrEqual(0);
    expect(results[0]!.nlpScore).toBeGreaterThanOrEqual(0);
    expect(results[0]!.nlpScore).toBeLessThanOrEqual(100);

    // Verify the correct config is self-consistent: with an empty plugboard every
    // stecker value must map to itself (verified via the exported lower-level API).
    const tablesAtPos0 = Array.from({ length: crib.length }, (_, i) =>
      buildScramblerTableAt(rotors, i + 1),
    );
    const edges = buildMenuEdges(crib, segment, tablesAtPos0, 0);
    const stecker = propagateMenuConstraints(edges, crib[0]!, crib[0]!);
    expect(stecker).not.toBeNull();
    for (const [key, value] of stecker!.entries()) {
      expect(key).toBe(value);
    }
  }, 60000);

  it('includes derivedPlugboard in every result', async () => {
    jest.useRealTimers();
    const rotors = [
      { ...rotorIII, config: { ...rotorIII.config, currentIndex: 0 } },
      { ...rotorII, config: { ...rotorII.config, currentIndex: 0 } },
      { ...rotorI, config: { ...rotorI.config, currentIndex: 0 } },
    ];
    const ciphertext = encryptString(
      'WITHTION',
      rotors,
      emptyPlugboard,
      reflectorB,
    );

    const results = await cribSearchAsync(
      ciphertext,
      'WITH',
      limitedRotors,
      { 2: initialReflectorState.reflectors[2]! },
      () => {},
    );

    for (const result of results) {
      expect(result.derivedPlugboard).toBeDefined();
      expect(typeof result.derivedPlugboard).toBe('object');
    }
  }, 60000);

  it('returns empty array when crib is longer than ciphertext', async () => {
    jest.useRealTimers();
    const progressValues: number[] = [];

    const results = await cribSearchAsync(
      'ABC',
      'HELLO',
      limitedRotors,
      { 2: initialReflectorState.reflectors[2]! },
      (p) => progressValues.push(p),
    );

    expect(results).toEqual([]);
    expect(progressValues[progressValues.length - 1]).toBe(1);
  });

  it('calls onProgress from 0 to 1', async () => {
    jest.useRealTimers();
    const rotors = [
      { ...rotorIII, config: { ...rotorIII.config, currentIndex: 0 } },
      { ...rotorII, config: { ...rotorII.config, currentIndex: 0 } },
      { ...rotorI, config: { ...rotorI.config, currentIndex: 0 } },
    ];
    const ciphertext = encryptString(
      'WITHTION',
      rotors,
      emptyPlugboard,
      reflectorB,
    );
    const progressValues: number[] = [];

    await cribSearchAsync(
      ciphertext,
      'WITH',
      limitedRotors,
      { 2: initialReflectorState.reflectors[2]! },
      (p) => progressValues.push(p),
    );

    expect(progressValues.length).toBeGreaterThan(0);
    expect(progressValues[progressValues.length - 1]).toBe(1);
  }, 60000);
});
