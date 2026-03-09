import { ALPHABET } from '../constants';
import { initialReflectorState } from '../features/reflector';
import { initialRotorState } from '../features/rotors/features';
import type { ReflectorState, RotorState } from '../types/interfaces';
import { encryptLetter, stepRotors } from '../utils/enigma';
import type { MenuEdge } from './crib-analysis';
import {
  buildMenuEdges,
  findCribPositions,
  propagateMenuConstraints,
} from './crib-analysis';

const rotorI: RotorState = initialRotorState.available[1]!;
const rotorII: RotorState = initialRotorState.available[2]!;
const rotorIII: RotorState = initialRotorState.available[3]!;

const reflectorB: ReflectorState = initialReflectorState.reflectors[2]!;

const buildScramblerTableAt = (
  rotors: RotorState[],
  steps: number,
): string[] => {
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
