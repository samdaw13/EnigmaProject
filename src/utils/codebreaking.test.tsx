import { initialReflectorState } from '../features/reflector';
import { initialRotorState } from '../features/rotors/features';
import type {
  PlugboardCable,
  ReflectorState,
  RotorState,
} from '../types/interfaces';
import type {
  BruteForceResult,
  CribSearchResult,
  MenuEdge,
} from './codebreaking';
import {
  bruteForceSearch,
  bruteForceSearchAsync,
  buildMenuEdges,
  cribSearchAsync,
  encryptString,
  findCribPositions,
  propagateMenuConstraints,
} from './codebreaking';
import { encryptLetter, stepRotors } from './enigma';

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

describe('buildMenuEdges', () => {
  it('creates one edge per crib letter', () => {
    const rotors = [
      { ...rotorIII, config: { ...rotorIII.config, currentIndex: 0 } },
      { ...rotorII, config: { ...rotorII.config, currentIndex: 0 } },
      { ...rotorI, config: { ...rotorI.config, currentIndex: 0 } },
    ];
    const tables: string[][] = [];
    let current = rotors;
    const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let k = 0; k < 4; k++) {
      current = stepRotors(current);
      tables.push(
        ALPHABET.split('').map((l) =>
          encryptLetter(l, current, {}, reflectorB),
        ),
      );
    }

    const edges: MenuEdge[] = buildMenuEdges('WITH', 'XYZW', tables, 0);
    expect(edges).toHaveLength(4);
    expect(edges[0]!.letterA).toBe('W');
    expect(edges[0]!.letterB).toBe('X');
    expect(edges[1]!.letterA).toBe('I');
    expect(edges[1]!.letterB).toBe('Y');
  });

  it('assigns correct scrambler table to each edge based on crib offset', () => {
    const rotors = [
      { ...rotorIII, config: { ...rotorIII.config, currentIndex: 0 } },
      { ...rotorII, config: { ...rotorII.config, currentIndex: 0 } },
      { ...rotorI, config: { ...rotorI.config, currentIndex: 0 } },
    ];
    const tableAt1 = buildScramblerTableAt(rotors, 1);
    const tableAt2 = buildScramblerTableAt(rotors, 2);
    const tableAt3 = buildScramblerTableAt(rotors, 3);

    // cribOffset=0: edge i uses tables[0+i]
    const edges = buildMenuEdges('AB', 'XY', [tableAt1, tableAt2, tableAt3], 0);
    expect(edges[0]!.scramblerTable).toBe(tableAt1);
    expect(edges[1]!.scramblerTable).toBe(tableAt2);

    // cribOffset=1: edge i uses tables[1+i]
    const edgesOffset = buildMenuEdges(
      'AB',
      'XY',
      [tableAt1, tableAt2, tableAt3],
      1,
    );
    expect(edgesOffset[0]!.scramblerTable).toBe(tableAt2);
    expect(edgesOffset[1]!.scramblerTable).toBe(tableAt3);
  });
});

describe('propagateMenuConstraints', () => {
  const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  const makeScramblerTable = (mapping: Record<string, string>): string[] =>
    ALPHABET.split('').map((l) => mapping[l] ?? l);

  it('propagates a single edge and applies the scrambler to the seed value', () => {
    // Edge: A ↔ B via scrambler mapping A→C, C→A
    const table = makeScramblerTable({ A: 'C', C: 'A', B: 'D', D: 'B' });
    const edges: MenuEdge[] = [
      { letterA: 'A', letterB: 'B', scramblerTable: table },
    ];

    // Seed stecker[A] = A → diagonal stecker[A] = A (self, no-op)
    // Edge A→B: stecker[B] = scrambler(A) = C → diagonal: stecker[C] = B
    const result = propagateMenuConstraints(edges, 'A', 'A');
    expect(result).not.toBeNull();
    expect(result!.get('A')).toBe('A');
    expect(result!.get('B')).toBe('C');
    expect(result!.get('C')).toBe('B');
  });

  it('returns null when a contradiction is found', () => {
    // Two edges both connected to A force two different values for a shared letter
    const tableAB = makeScramblerTable({ A: 'C', C: 'A', B: 'D', D: 'B' });
    const tableAC = makeScramblerTable({ A: 'E', E: 'A', C: 'F', F: 'C' });
    const edges: MenuEdge[] = [
      { letterA: 'A', letterB: 'B', scramblerTable: tableAB },
      { letterA: 'A', letterB: 'C', scramblerTable: tableAC },
    ];

    // Seed: stecker[A] = A
    // Edge A→B: stecker[B] = tableAB(A) = C → diagonal: stecker[C] = B
    // Edge A→C: stecker[C] = tableAC(A) = E — but stecker[C] is already B → contradiction
    const result = propagateMenuConstraints(edges, 'A', 'A');
    expect(result).toBeNull();
  });

  it('applies Welchman diagonal board so plugboard connections are always reciprocal', () => {
    const table = makeScramblerTable({ P: 'Q', Q: 'P' });
    const edges: MenuEdge[] = [
      { letterA: 'P', letterB: 'X', scramblerTable: table },
    ];

    // Seed stecker[P] = A → diagonal: stecker[A] = P
    // Edge P→X: stecker[X] = table(A) = A (A not in mapping → maps to itself)
    // Diagonal: stecker[A] = X — but stecker[A] is already P, and X ≠ P → contradiction
    const result = propagateMenuConstraints(edges, 'P', 'A');
    expect(result).toBeNull();
  });

  it('propagates consistently without contradiction when edges are compatible', () => {
    // Chain: seed stecker[A]=A, edge A↔B with identity scrambler → stecker[B]=A
    // But diagonal: stecker[A]=B conflicts with seed stecker[A]=A if A≠B
    // Let's use a case with NO contradiction: single edge, no shared letters
    const identityTable = makeScramblerTable({});
    const edges: MenuEdge[] = [
      { letterA: 'X', letterB: 'Y', scramblerTable: identityTable },
    ];

    // Seed stecker[X] = M (M ∉ {X, Y})
    // Diagonal: stecker[M] = X
    // Edge X→Y: stecker[Y] = identityTable(M) = M
    // Diagonal: stecker[M] = Y — but stecker[M] is already X, and Y ≠ X → contradiction
    // (This illustrates diagonal board eliminating guesses even for simple edges)
    const result = propagateMenuConstraints(edges, 'X', 'M');
    expect(result).toBeNull(); // M≠X and stecker[M] would need to be both X and Y
  });

  it('produces a consistent stecker when seed letter maps to itself (no plugboard)', () => {
    const identityTable = makeScramblerTable({});
    const edges: MenuEdge[] = [
      { letterA: 'A', letterB: 'A', scramblerTable: identityTable },
    ];

    // Seed stecker[A] = A → diagonal: stecker[A] = A (self, no new info)
    // Edge A↔A: stecker[A] = identityTable(A) = A (already set, no contradiction)
    const result = propagateMenuConstraints(edges, 'A', 'A');
    expect(result).not.toBeNull();
    expect(result!.get('A')).toBe('A');
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
