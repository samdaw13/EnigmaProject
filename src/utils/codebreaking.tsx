import type {
  PlugboardCable,
  ReflectorState,
  RotorState,
} from '../types/interfaces';
import { encryptLetter, stepRotors } from './enigma';
import { nlpConfidence } from './nlp';

export interface CribSearchResult {
  rotorIds: number[];
  reflectorName: string;
  startingPositions: number[];
  cribPosition: number;
  decryptedText: string;
  nlpScore: number;
  derivedPlugboard: PlugboardCable;
}

export interface MenuEdge {
  letterA: string;
  letterB: string;
  scramblerTable: string[];
}

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const createRotorWithPosition = (
  rotor: RotorState,
  position: number,
): RotorState => ({
  ...rotor,
  config: { ...rotor.config, currentIndex: position },
});

export const encryptString = (
  plaintext: string,
  rotors: RotorState[],
  plugboard: PlugboardCable,
  reflector: ReflectorState,
): string => {
  let currentRotors = rotors;
  let result = '';

  for (const letter of plaintext) {
    currentRotors = stepRotors(currentRotors);
    result += encryptLetter(letter, currentRotors, plugboard, reflector);
  }

  return result;
};

const generateRotorPermutations = (rotorIds: number[]): number[][] => {
  const permutations: number[][] = [];
  for (let i = 0; i < rotorIds.length; i++) {
    for (let j = 0; j < rotorIds.length; j++) {
      if (j === i) continue;
      for (let k = 0; k < rotorIds.length; k++) {
        if (k === i || k === j) continue;
        permutations.push([rotorIds[i]!, rotorIds[j]!, rotorIds[k]!]);
      }
    }
  }
  return permutations;
};

const MAX_CRIB_RESULTS = 20;

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

// ─── Bombe helpers (exported for unit testing) ───────────────────────────────

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
        // Scrambler is self-inverse, so inverse equals forward application
        queue.push([
          edge.letterA,
          edge.scramblerTable[ALPHABET.indexOf(value)]!,
        ]);
      }
    }
  }

  return stecker;
};

// ─── Fast integer path for crib search ───────────────────────────────────────

// Lookup table replacing `% 26` for values in [0, 51].
// Inputs: (letter_index + offset) ∈ [0,50] and (fwd_value - offset + 26) ∈ [1,51].
const MOD26 = new Uint8Array(52);
for (let i = 0; i < 52; i++) MOD26[i] = i % 26;

interface RotorIntTables {
  fwd: Uint8Array;
  inv: Uint8Array;
}

const buildRotorIntTables = (rotor: RotorState): RotorIntTables => {
  const fwd = new Uint8Array(26);
  const inv = new Uint8Array(26);
  for (let i = 0; i < 26; i++) {
    const fi = rotor.config.mappedLetters[i]!.charCodeAt(0) - 65;
    fwd[i] = fi;
    inv[fi] = i;
  }
  return { fwd, inv };
};

// Integer rotor stepping — mirrors stepRotors() without object allocation.
// rStep/mStep are the notch positions for right and middle rotors.
const intStepRotors = (
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

interface MenuAdjInt {
  adjOther: number[][];
  adjStep: number[][];
  testLetter: number;
}

const buildMenuAdjInt = (crib: string, segment: string): MenuAdjInt => {
  const adjOther: number[][] = Array.from({ length: 26 }, () => []);
  const adjStep: number[][] = Array.from({ length: 26 }, () => []);
  const degree = new Uint8Array(26);

  for (let i = 0; i < crib.length; i++) {
    const a = crib.charCodeAt(i) - 65;
    const b = segment.charCodeAt(i) - 65;
    adjOther[a]!.push(b);
    adjStep[a]!.push(i);
    adjOther[b]!.push(a);
    adjStep[b]!.push(i);
    degree[a]!++;
    degree[b]!++;
  }

  let testLetter = 0;
  let maxDeg = 0;
  for (let i = 0; i < 26; i++) {
    if (degree[i]! > maxDeg) {
      maxDeg = degree[i]!;
      testLetter = i;
    }
  }

  return { adjOther, adjStep, testLetter };
};

// BFS constraint propagation using a pre-allocated Int16Array ring buffer.
// posScramblerFlat is a flat Uint8Array of shape [cribLen × 26]:
//   posScramblerFlat[step * 26 + inputIdx] = outputIdx
// This single flat dereference is faster than a nested Uint8Array[].
const BFS_BUF_SIZE = 512;

const propagateIntHypothesis = (
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
      queueBuf[tail++] = posScramblerFlat[steps[ni]! * 26 + value]!;
    }
  }

  return true;
};

const steckerIntToPlugboard = (stecker: Int8Array): PlugboardCable => {
  const plugboard: PlugboardCable = {};
  for (let i = 0; i < 26; i++) {
    const v = stecker[i]!;
    if (v !== -1 && v !== i) {
      plugboard[ALPHABET[i]!] = ALPHABET[v]!;
    }
  }
  return plugboard;
};

// Integer-only crib verification — avoids string-based encryptLetter calls.
// Uses the precomputed scrambler tables and the BFS-derived stecker directly.
// stecker values: -1 = identity (unswapped), 0-25 = swapped letter index.
const steckerVerifiesCrib = (
  stecker: Int8Array,
  segmentCodes: Uint8Array,
  cribCodes: Uint8Array,
  posScramblerFlat: Uint8Array,
): boolean => {
  for (let i = 0; i < cribCodes.length; i++) {
    let x: number = segmentCodes[i]!;
    const pb1 = stecker[x]!;
    if (pb1 !== -1) x = pb1;
    x = posScramblerFlat[i * 26 + x]!;
    const pb2 = stecker[x]!;
    if (pb2 !== -1) x = pb2;
    if (x !== cribCodes[i]!) return false;
  }
  return true;
};

// ─── Production Bombe ────────────────────────────────────────────────────────

export const cribSearchAsync = (
  ciphertext: string,
  crib: string,
  allRotors: { [id: number]: RotorState },
  allReflectors: { [id: number]: ReflectorState },
  onProgress: (progress: number) => void,
  isCancelled?: () => boolean,
): Promise<CribSearchResult[]> => {
  const validPositions = findCribPositions(ciphertext, crib);

  if (validPositions.length === 0) {
    onProgress(1);
    return Promise.resolve([]);
  }

  const rotorIds = Object.keys(allRotors).map(Number);
  const permutations = generateRotorPermutations(rotorIds);
  const allResults: CribSearchResult[] = [];

  // ── One-time setup (outside all rotor loops) ──────────────────────────────

  const rotorIntTables: { [id: number]: RotorIntTables } = {};
  for (const id of rotorIds) {
    rotorIntTables[id] = buildRotorIntTables(allRotors[id]!);
  }

  const reflectorIntMaps: { [id: number]: Uint8Array } = {};
  for (const id of Object.keys(allReflectors).map(Number)) {
    const m = new Uint8Array(26);
    for (let i = 0; i < 26; i++) {
      m[i] = allReflectors[id]!.config.mapping[i]!.charCodeAt(0) - 65;
    }
    reflectorIntMaps[id] = m;
  }

  const cribCodes = new Uint8Array(crib.length);
  for (let i = 0; i < crib.length; i++) {
    cribCodes[i] = crib.charCodeAt(i) - 65;
  }

  // Menu adjacency structures are static (depend only on crib + ciphertext)
  const menusByPos = new Map<number, MenuAdjInt>();
  const segmentCodesByPos = new Map<number, Uint8Array>();
  for (const pos of validPositions) {
    const segment = ciphertext.slice(pos, pos + crib.length);
    menusByPos.set(pos, buildMenuAdjInt(crib, segment));
    const codes = new Uint8Array(crib.length);
    for (let i = 0; i < crib.length; i++) {
      codes[i] = ciphertext.charCodeAt(pos + i) - 65;
    }
    segmentCodesByPos.set(pos, codes);
  }

  // Identify which scrambler steps are needed across all valid crib positions
  const neededScramblerStepSet = new Set<number>();
  for (const pos of validPositions) {
    for (let i = 0; i < crib.length; i++) {
      neededScramblerStepSet.add(pos + i + 1);
    }
  }
  const neededScramblerSteps = [...neededScramblerStepSet];
  const maxStep = Math.max(...neededScramblerSteps);

  // Preallocate scratch buffers — reused across all rotor setting iterations
  const rPos = new Uint8Array(maxStep + 1);
  const mPos = new Uint8Array(maxStep + 1);
  const lPos = new Uint8Array(maxStep + 1);
  const stepOut = new Uint8Array(3);
  // One Uint8Array(26) scrambler slot per step, rewritten each rotor setting
  const scramblerSlots: Uint8Array[] = Array.from(
    { length: maxStep + 1 },
    () => new Uint8Array(26),
  );
  // Flat scrambler buffer for one crib position: [cribLen × 26] bytes.
  // posScramblerFlat[step * 26 + inputIdx] = outputIdx.
  const posScramblerFlat = new Uint8Array(crib.length * 26);
  // Pre-extracted arrays to avoid Map.get() inside the 26³ loop
  const menusArray = validPositions.map((pos) => menusByPos.get(pos)!);
  const segCodesArray = validPositions.map(
    (pos) => segmentCodesByPos.get(pos)!,
  );
  const stecker = new Int8Array(26);
  const queueBuf = new Int16Array(BFS_BUF_SIZE);

  return new Promise((resolve) => {
    let index = 0;

    const processPerm = (perm: number[]) => {
      const [rId, mId, lId] = perm as [number, number, number];
      const rStep = allRotors[rId]!.config.stepIndex;
      const mStep = allRotors[mId]!.config.stepIndex;
      // Hoist typed array references out of the 26³ loop — avoids repeated
      // property lookups on the rotorIntTables object in the hot path.
      const rFwd = rotorIntTables[rId]!.fwd;
      const rInv = rotorIntTables[rId]!.inv;
      const mFwd = rotorIntTables[mId]!.fwd;
      const mInv = rotorIntTables[mId]!.inv;
      const lFwd = rotorIntTables[lId]!.fwd;
      const lInv = rotorIntTables[lId]!.inv;

      for (const reflectorId of Object.keys(allReflectors).map(Number)) {
        const reflMap = reflectorIntMaps[reflectorId]!;
        const reflector = allReflectors[reflectorId]!;

        for (let p0 = 0; p0 < 26; p0++) {
          for (let p1 = 0; p1 < 26; p1++) {
            for (let p2 = 0; p2 < 26; p2++) {
              // Compute rotor positions at every step up to maxStep using
              // pure integer arithmetic — no RotorState object allocation.
              rPos[0] = p0;
              mPos[0] = p1;
              lPos[0] = p2;
              for (let s = 1; s <= maxStep; s++) {
                intStepRotors(
                  rPos[s - 1]!,
                  mPos[s - 1]!,
                  lPos[s - 1]!,
                  rStep,
                  mStep,
                  stepOut,
                );
                rPos[s] = stepOut[0]!;
                mPos[s] = stepOut[1]!;
                lPos[s] = stepOut[2]!;
              }

              // Precompute the 26-entry scrambler lookup for each needed step.
              // Uses MOD26 table instead of % 26 to avoid expensive modulo ops.
              for (let si = 0; si < neededScramblerSteps.length; si++) {
                const step = neededScramblerSteps[si]!;
                const slot = scramblerSlots[step]!;
                const ro = rPos[step]!,
                  mo = mPos[step]!,
                  lo = lPos[step]!;
                for (let j = 0; j < 26; j++) {
                  let x = MOD26[rFwd[MOD26[j + ro]!]! - ro + 26]!;
                  x = MOD26[mFwd[MOD26[x + mo]!]! - mo + 26]!;
                  x = MOD26[lFwd[MOD26[x + lo]!]! - lo + 26]!;
                  x = reflMap[x]!;
                  x = MOD26[lInv[MOD26[x + lo]!]! - lo + 26]!;
                  x = MOD26[mInv[MOD26[x + mo]!]! - mo + 26]!;
                  slot[j] = MOD26[rInv[MOD26[x + ro]!]! - ro + 26]!;
                }
              }

              for (let pi = 0; pi < validPositions.length; pi++) {
                const pos = validPositions[pi]!;
                const menu = menusArray[pi]!;
                const segCodes = segCodesArray[pi]!;

                // Copy scrambler rows for this crib position into a flat buffer
                // [step * 26 .. step * 26 + 25] for single-dereference BFS access.
                for (let i = 0; i < crib.length; i++) {
                  posScramblerFlat.set(scramblerSlots[pos + i + 1]!, i * 26);
                }

                // Try all 26 stecker hypotheses for the most-connected letter.
                // The diagonal board and menu loops reject most hypotheses in
                // just a few BFS steps, making this very fast in practice.
                for (let hypothesis = 0; hypothesis < 26; hypothesis++) {
                  if (
                    !propagateIntHypothesis(
                      menu.testLetter,
                      hypothesis,
                      menu.adjOther,
                      menu.adjStep,
                      posScramblerFlat,
                      stecker,
                      queueBuf,
                    )
                  ) {
                    continue;
                  }

                  // Fast integer verification: apply stecker→scrambler→stecker
                  // to each cipher letter and confirm it matches the crib.
                  // Uses the already-computed posScramblerFlat — no string ops.
                  if (
                    !steckerVerifiesCrib(
                      stecker,
                      segCodes,
                      cribCodes,
                      posScramblerFlat,
                    )
                  ) {
                    continue;
                  }

                  const derivedPlugboard = steckerIntToPlugboard(stecker);

                  const fullRotors = [
                    createRotorWithPosition(allRotors[rId]!, p0),
                    createRotorWithPosition(allRotors[mId]!, p1),
                    createRotorWithPosition(allRotors[lId]!, p2),
                  ];
                  const decryptedText = encryptString(
                    ciphertext,
                    fullRotors,
                    derivedPlugboard,
                    reflector,
                  );
                  allResults.push({
                    rotorIds: perm,
                    reflectorName: reflector.name,
                    startingPositions: [p0, p1, p2],
                    cribPosition: pos,
                    decryptedText,
                    nlpScore: nlpConfidence(decryptedText),
                    derivedPlugboard,
                  });
                  break;
                }
              }
            }
          }
        }
      }
    };

    const processNext = () => {
      if (isCancelled?.() === true) {
        resolve([]);
        return;
      }

      if (index >= permutations.length) {
        onProgress(1);
        setTimeout(() => {
          if (isCancelled?.() === true) {
            resolve([]);
            return;
          }
          allResults.sort((a, b) => b.nlpScore - a.nlpScore);
          resolve(allResults.slice(0, MAX_CRIB_RESULTS));
        }, 0);
        return;
      }

      processPerm(permutations[index]!);
      index++;
      onProgress(index / permutations.length);
      setTimeout(processNext, 0);
    };

    // Defer first tick so React can render the searching state before work begins
    setTimeout(processNext, 0);
  });
};
