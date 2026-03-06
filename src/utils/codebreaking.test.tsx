import { initialReflectorState } from '../features/reflector';
import { initialRotorState } from '../features/rotors/features';
import type {
  PlugboardCable,
  ReflectorState,
  RotorState,
} from '../types/interfaces';
import type { BruteForceResult, CribSearchResult } from './codebreaking';
import {
  bruteForceSearch,
  bruteForceSearchAsync,
  cribSearchAsync,
  encryptString,
  findCribPositions,
} from './codebreaking';

const rotorI: RotorState = initialRotorState.available[1]!;
const rotorII: RotorState = initialRotorState.available[2]!;
const rotorIII: RotorState = initialRotorState.available[3]!;

const reflectorB: ReflectorState = initialReflectorState.reflectors[2]!;
const emptyPlugboard: PlugboardCable = {};

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

describe('bruteForceSearch', () => {
  it('finds the correct configuration for a known pair', () => {
    const rotors = [
      { ...rotorIII, config: { ...rotorIII.config, currentIndex: 0 } },
      { ...rotorII, config: { ...rotorII.config, currentIndex: 0 } },
      { ...rotorI, config: { ...rotorI.config, currentIndex: 0 } },
    ];
    const plaintext = 'HI';
    const ciphertext = encryptString(
      plaintext,
      rotors,
      emptyPlugboard,
      reflectorB,
    );

    const results: BruteForceResult[] = bruteForceSearch(
      ciphertext,
      plaintext,
      initialRotorState.available,
      { 2: initialReflectorState.reflectors[2]! },
    );

    const matchingResult = results.find(
      (r) =>
        r.rotorIds[0] === 3 &&
        r.rotorIds[1] === 2 &&
        r.rotorIds[2] === 1 &&
        r.startingPositions[0] === 0 &&
        r.startingPositions[1] === 0 &&
        r.startingPositions[2] === 0,
    );
    expect(matchingResult).toBeDefined();
    expect(matchingResult!.reflectorName).toBe('UKW-B');
    expect(matchingResult!.decryptedText).toBeTruthy();
    expect(matchingResult!.nlpScore).toBeGreaterThanOrEqual(0);
    expect(matchingResult!.nlpScore).toBeLessThanOrEqual(100);
  });

  it('returns empty array when no config matches', () => {
    const results = bruteForceSearch(
      'ZZ',
      'ZZ',
      initialRotorState.available,
      initialReflectorState.reflectors,
    );
    expect(results).toEqual([]);
  });
});

describe('bruteForceSearchAsync', () => {
  it('finds the same results as synchronous version', async () => {
    jest.useRealTimers();
    const rotors = [
      { ...rotorIII, config: { ...rotorIII.config, currentIndex: 0 } },
      { ...rotorII, config: { ...rotorII.config, currentIndex: 0 } },
      { ...rotorI, config: { ...rotorI.config, currentIndex: 0 } },
    ];
    const plaintext = 'HI';
    const ciphertext = encryptString(
      plaintext,
      rotors,
      emptyPlugboard,
      reflectorB,
    );

    const singleReflector = { 2: initialReflectorState.reflectors[2]! };
    const progressValues: number[] = [];

    const results = await bruteForceSearchAsync(
      ciphertext,
      plaintext,
      initialRotorState.available,
      singleReflector,
      (p) => progressValues.push(p),
    );

    const matchingResult = results.find(
      (r) =>
        r.rotorIds[0] === 3 &&
        r.rotorIds[1] === 2 &&
        r.rotorIds[2] === 1 &&
        r.startingPositions[0] === 0 &&
        r.startingPositions[1] === 0 &&
        r.startingPositions[2] === 0,
    );
    expect(matchingResult).toBeDefined();
    expect(matchingResult!.reflectorName).toBe('UKW-B');
    expect(matchingResult!.decryptedText).toBeTruthy();
    expect(matchingResult!.nlpScore).toBeGreaterThanOrEqual(0);
    expect(matchingResult!.nlpScore).toBeLessThanOrEqual(100);
  });

  it('calls onProgress with increasing values up to 1', async () => {
    jest.useRealTimers();
    const progressValues: number[] = [];

    await bruteForceSearchAsync(
      'ZZ',
      'ZZ',
      initialRotorState.available,
      { 2: initialReflectorState.reflectors[2]! },
      (p) => progressValues.push(p),
    );

    expect(progressValues.length).toBeGreaterThan(0);
    expect(progressValues[progressValues.length - 1]).toBe(1);
    for (let i = 1; i < progressValues.length; i++) {
      expect(progressValues[i]).toBeGreaterThanOrEqual(progressValues[i - 1]!);
    }
  });
});

// Limit rotors to III, II, I for faster crib search tests (6 perms vs 60)
const limitedRotors = {
  1: initialRotorState.available[1]!,
  2: initialRotorState.available[2]!,
  3: initialRotorState.available[3]!,
};

describe('cribSearchAsync', () => {
  it('finds a matching result when the crib is present in the decrypted text', async () => {
    jest.useRealTimers();
    // 'WITHTION' contains high-value quadgrams WITH and TION, so NLP scoring
    // reliably ranks the correct config above false positives
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

    const singleReflector = { 2: initialReflectorState.reflectors[2]! };
    const results: CribSearchResult[] = await cribSearchAsync(
      ciphertext,
      crib,
      limitedRotors,
      singleReflector,
      () => {},
    );

    const matchingResult = results.find(
      (r) =>
        r.rotorIds[0] === 3 &&
        r.rotorIds[1] === 2 &&
        r.rotorIds[2] === 1 &&
        r.startingPositions[0] === 0 &&
        r.startingPositions[1] === 0 &&
        r.startingPositions[2] === 0,
    );
    expect(matchingResult).toBeDefined();
    expect(matchingResult!.decryptedText).toBe('WITHTION');
    expect(matchingResult!.cribPosition).toBe(0);
    expect(matchingResult!.nlpScore).toBeGreaterThanOrEqual(0);
    expect(matchingResult!.nlpScore).toBeLessThanOrEqual(100);
  });

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
  });
});

describe('findCribPositions', () => {
  it('eliminates positions where crib letter matches ciphertext letter', () => {
    const ciphertext = 'ABCDEF';
    const crib = 'AB';
    const positions = findCribPositions(ciphertext, crib);
    expect(positions).not.toContain(0);
  });

  it('returns valid positions where no letter matches', () => {
    const ciphertext = 'ABCDEF';
    const crib = 'XY';
    const positions = findCribPositions(ciphertext, crib);
    expect(positions).toContain(0);
    expect(positions).toContain(1);
    expect(positions).toContain(2);
    expect(positions).toContain(3);
    expect(positions).toContain(4);
  });

  it('handles crib that matches at specific positions', () => {
    const ciphertext = 'AXBYCZ';
    const crib = 'ABC';
    const positions = findCribPositions(ciphertext, crib);
    expect(positions).not.toContain(0);
    expect(positions).not.toContain(2);
  });

  it('returns empty array when crib is longer than ciphertext', () => {
    const positions = findCribPositions('AB', 'ABCDEF');
    expect(positions).toEqual([]);
  });

  it('handles single character crib', () => {
    const ciphertext = 'ABCDA';
    const crib = 'A';
    const positions = findCribPositions(ciphertext, crib);
    expect(positions).not.toContain(0);
    expect(positions).toContain(1);
    expect(positions).toContain(2);
    expect(positions).toContain(3);
    expect(positions).not.toContain(4);
  });
});
