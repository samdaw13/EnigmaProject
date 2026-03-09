import type { PlugboardCable } from '../types/interfaces';
import { ALPHABET_SIZE, indexToLetter, letterToIndex } from './enigma-int';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export interface MenuEdge {
  letterA: string;
  letterB: string;
  scramblerTable: string[];
}

export const findCribPositions = (
  ciphertext: string,
  crib: string,
): number[] => {
  const validPositions: number[] = [];
  const maxPosition = ciphertext.length - crib.length;

  for (let pos = 0; pos <= maxPosition; pos++) {
    let isValid = true;
    for (let i = 0; i < crib.length; i++) {
      if (crib[i] === ciphertext[pos + i]) {
        isValid = false;
        break;
      }
    }
    if (isValid) {
      validPositions.push(pos);
    }
  }

  return validPositions;
};

export const buildMenuEdges = (
  crib: string,
  ciphertextSegment: string,
  scramblerTables: string[][],
  cribOffset: number,
): MenuEdge[] =>
  crib.split('').map((p, i) => ({
    letterA: p,
    letterB: ciphertextSegment[i]!,
    scramblerTable: scramblerTables[cribOffset + i]!,
  }));

export const propagateMenuConstraints = (
  edges: MenuEdge[],
  seedLetter: string,
  seedValue: string,
): Map<string, string> | null => {
  const stecker = new Map<string, string>();
  const queue: [string, string][] = [[seedLetter, seedValue]];

  while (queue.length > 0) {
    const [letter, value] = queue.shift()!;

    if (stecker.has(letter)) {
      if (stecker.get(letter) !== value) return null;
      continue;
    }
    stecker.set(letter, value);

    // Welchman diagonal board: plugboard connections are always reciprocal
    queue.push([value, letter]);

    for (const edge of edges) {
      if (edge.letterA === letter) {
        queue.push([
          edge.letterB,
          edge.scramblerTable[ALPHABET.indexOf(value)]!,
        ]);
      } else if (edge.letterB === letter) {
        queue.push([
          edge.letterA,
          edge.scramblerTable[ALPHABET.indexOf(value)]!,
        ]);
      }
    }
  }

  return stecker;
};

export interface MenuAdjInt {
  adjOther: number[][];
  adjStep: number[][];
  testLetter: number;
}

export const buildMenuAdjInt = (crib: string, segment: string): MenuAdjInt => {
  const adjOther: number[][] = Array.from({ length: ALPHABET_SIZE }, () => []);
  const adjStep: number[][] = Array.from({ length: ALPHABET_SIZE }, () => []);
  const degree = new Uint8Array(ALPHABET_SIZE);

  for (let i = 0; i < crib.length; i++) {
    const a = letterToIndex(crib[i]!);
    const b = letterToIndex(segment[i]!);
    adjOther[a]!.push(b);
    adjStep[a]!.push(i);
    adjOther[b]!.push(a);
    adjStep[b]!.push(i);
    degree[a]!++;
    degree[b]!++;
  }

  let testLetter = 0;
  let maxDeg = 0;
  for (let i = 0; i < ALPHABET_SIZE; i++) {
    if (degree[i]! > maxDeg) {
      maxDeg = degree[i]!;
      testLetter = i;
    }
  }

  return { adjOther, adjStep, testLetter };
};

const BFS_BUF_SIZE = 512;

export const propagateIntHypothesis = (
  seedLetter: number,
  seedValue: number,
  adjOther: number[][],
  adjStep: number[][],
  posScramblerFlat: Uint8Array,
  stecker: Int8Array,
  queueBuf: Int16Array,
): boolean => {
  stecker.fill(-1);
  let head = 0;
  let tail = 0;

  queueBuf[tail++] = seedLetter;
  queueBuf[tail++] = seedValue;

  while (head < tail) {
    const letter = queueBuf[head++]!;
    const value = queueBuf[head++]!;

    if (stecker[letter] !== -1) {
      if (stecker[letter] !== value) return false;
      continue;
    }
    stecker[letter] = value;

    // Welchman diagonal board: plugboard connections are reciprocal
    queueBuf[tail++] = value;
    queueBuf[tail++] = letter;

    const neighbors = adjOther[letter]!;
    const steps = adjStep[letter]!;
    for (let ni = 0; ni < neighbors.length; ni++) {
      queueBuf[tail++] = neighbors[ni]!;
      queueBuf[tail++] = posScramblerFlat[steps[ni]! * ALPHABET_SIZE + value]!;
    }
  }

  return true;
};

export const allocateBfsBuffers = (): {
  stecker: Int8Array;
  queueBuf: Int16Array;
} => ({
  stecker: new Int8Array(ALPHABET_SIZE),
  queueBuf: new Int16Array(BFS_BUF_SIZE),
});

export const steckerIntToPlugboard = (stecker: Int8Array): PlugboardCable => {
  const plugboard: PlugboardCable = {};
  for (let i = 0; i < ALPHABET_SIZE; i++) {
    const v = stecker[i]!;
    if (v !== -1 && v !== i) {
      plugboard[indexToLetter(i)] = indexToLetter(v);
    }
  }
  return plugboard;
};

export const steckerVerifiesCrib = (
  stecker: Int8Array,
  segmentCodes: Uint8Array,
  cribCodes: Uint8Array,
  posScramblerFlat: Uint8Array,
): boolean => {
  let verified = 0;
  for (let i = 0; i < cribCodes.length; i++) {
    let x: number = segmentCodes[i]!;
    const pb1 = stecker[x]!;
    if (pb1 === -1) continue;
    x = pb1;
    x = posScramblerFlat[i * ALPHABET_SIZE + x]!;
    const pb2 = stecker[x]!;
    if (pb2 === -1) continue;
    x = pb2;
    if (x !== cribCodes[i]!) return false;
    verified++;
  }
  return verified > 0;
};
