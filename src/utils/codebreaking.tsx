import type {
  PlugboardCable,
  ReflectorState,
  RotorState,
} from '../types/interfaces';
import { encryptLetter, stepRotors } from './enigma';
import { computeIoC, nlpConfidence } from './nlp';

export interface BruteForceResult {
  rotorIds: number[];
  reflectorName: string;
  startingPositions: number[];
  decryptedText: string;
  nlpScore: number;
}

export interface CribSearchResult {
  rotorIds: number[];
  reflectorName: string;
  startingPositions: number[];
  cribPosition: number;
  decryptedText: string;
  nlpScore: number;
}

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

const IOC_THRESHOLD = 0.05;
const MAX_CRIB_RESULTS = 20;

const processPermutation = (
  perm: number[],
  ciphertext: string,
  knownPlaintext: string | undefined,
  allRotors: { [id: number]: RotorState },
  allReflectors: { [id: number]: ReflectorState },
): BruteForceResult[] => {
  const results: BruteForceResult[] = [];
  const emptyPlugboard: PlugboardCable = {};

  for (const reflectorId of Object.keys(allReflectors).map(Number)) {
    const reflector = allReflectors[reflectorId]!;
    for (let p0 = 0; p0 < 26; p0++) {
      for (let p1 = 0; p1 < 26; p1++) {
        for (let p2 = 0; p2 < 26; p2++) {
          if (knownPlaintext !== undefined) {
            const checkRotors = [
              createRotorWithPosition(allRotors[perm[0]!]!, p0),
              createRotorWithPosition(allRotors[perm[1]!]!, p1),
              createRotorWithPosition(allRotors[perm[2]!]!, p2),
            ];
            const encrypted = encryptString(
              knownPlaintext,
              checkRotors,
              emptyPlugboard,
              reflector,
            );
            if (encrypted === ciphertext.slice(0, knownPlaintext.length)) {
              const freshRotors = [
                createRotorWithPosition(allRotors[perm[0]!]!, p0),
                createRotorWithPosition(allRotors[perm[1]!]!, p1),
                createRotorWithPosition(allRotors[perm[2]!]!, p2),
              ];
              const decryptedText = encryptString(
                ciphertext,
                freshRotors,
                emptyPlugboard,
                reflector,
              );
              results.push({
                rotorIds: perm,
                reflectorName: reflector.name,
                startingPositions: [p0, p1, p2],
                decryptedText,
                nlpScore: nlpConfidence(decryptedText),
              });
            }
          } else {
            const rotors = [
              createRotorWithPosition(allRotors[perm[0]!]!, p0),
              createRotorWithPosition(allRotors[perm[1]!]!, p1),
              createRotorWithPosition(allRotors[perm[2]!]!, p2),
            ];
            const decryptedText = encryptString(
              ciphertext,
              rotors,
              emptyPlugboard,
              reflector,
            );
            if (computeIoC(decryptedText) >= IOC_THRESHOLD) {
              results.push({
                rotorIds: perm,
                reflectorName: reflector.name,
                startingPositions: [p0, p1, p2],
                decryptedText,
                nlpScore: nlpConfidence(decryptedText),
              });
            }
          }
        }
      }
    }
  }

  return results;
};

export const bruteForceSearch = (
  ciphertext: string,
  knownPlaintext: string | undefined,
  allRotors: { [id: number]: RotorState },
  allReflectors: { [id: number]: ReflectorState },
): BruteForceResult[] => {
  const results: BruteForceResult[] = [];
  const rotorIds = Object.keys(allRotors).map(Number);
  const permutations = generateRotorPermutations(rotorIds);

  for (const perm of permutations) {
    results.push(
      ...processPermutation(
        perm,
        ciphertext,
        knownPlaintext,
        allRotors,
        allReflectors,
      ),
    );
  }

  results.sort((a, b) => b.nlpScore - a.nlpScore);
  return results;
};

export const bruteForceSearchAsync = (
  ciphertext: string,
  knownPlaintext: string | undefined,
  allRotors: { [id: number]: RotorState },
  allReflectors: { [id: number]: ReflectorState },
  onProgress: (progress: number) => void,
  isCancelled?: () => boolean,
): Promise<BruteForceResult[]> => {
  const rotorIds = Object.keys(allRotors).map(Number);
  const permutations = generateRotorPermutations(rotorIds);
  const totalPerms = permutations.length;
  const allResults: BruteForceResult[] = [];

  return new Promise((resolve) => {
    let index = 0;

    const processNext = () => {
      if (isCancelled?.() === true) {
        resolve([]);
        return;
      }

      if (index >= totalPerms) {
        onProgress(1);
        setTimeout(() => {
          if (isCancelled?.() === true) {
            resolve([]);
            return;
          }
          allResults.sort((a, b) => b.nlpScore - a.nlpScore);
          resolve(allResults);
        }, 0);
        return;
      }

      const results = processPermutation(
        permutations[index]!,
        ciphertext,
        knownPlaintext,
        allRotors,
        allReflectors,
      );
      allResults.push(...results);
      index++;
      onProgress(index / totalPerms);
      setTimeout(processNext, 0);
    };

    // Defer first tick so React can render the searching state before work begins
    setTimeout(processNext, 0);
  });
};

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
  const totalPerms = permutations.length;
  const allResults: CribSearchResult[] = [];
  const emptyPlugboard: PlugboardCable = {};

  return new Promise((resolve) => {
    let index = 0;

    const processPerm = (perm: number[]) => {
      for (const reflectorId of Object.keys(allReflectors).map(Number)) {
        const reflector = allReflectors[reflectorId]!;
        for (let p0 = 0; p0 < 26; p0++) {
          for (let p1 = 0; p1 < 26; p1++) {
            for (let p2 = 0; p2 < 26; p2++) {
              const rotors = [
                createRotorWithPosition(allRotors[perm[0]!]!, p0),
                createRotorWithPosition(allRotors[perm[1]!]!, p1),
                createRotorWithPosition(allRotors[perm[2]!]!, p2),
              ];
              const decryptedText = encryptString(
                ciphertext,
                rotors,
                emptyPlugboard,
                reflector,
              );
              for (const pos of validPositions) {
                if (decryptedText.slice(pos, pos + crib.length) === crib) {
                  allResults.push({
                    rotorIds: perm,
                    reflectorName: reflector.name,
                    startingPositions: [p0, p1, p2],
                    cribPosition: pos,
                    decryptedText,
                    nlpScore: nlpConfidence(decryptedText),
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

      if (index >= totalPerms) {
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
      onProgress(index / totalPerms);
      setTimeout(processNext, 0);
    };

    // Defer first tick so React can render the searching state before work begins
    setTimeout(processNext, 0);
  });
};
