import {
  PlugboardCable,
  ReflectorState,
  RotorState,
} from '../types/interfaces';
import { encryptLetter, stepRotors } from './enigma';

export interface BruteForceResult {
  rotorIds: number[];
  reflectorName: string;
  startingPositions: number[];
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
        permutations.push([rotorIds[i], rotorIds[j], rotorIds[k]]);
      }
    }
  }
  return permutations;
};

export const bruteForceSearch = (
  ciphertext: string,
  knownPlaintext: string,
  allRotors: { [id: number]: RotorState },
  allReflectors: { [id: number]: ReflectorState },
): BruteForceResult[] => {
  const results: BruteForceResult[] = [];
  const rotorIds = Object.keys(allRotors).map(Number);
  const permutations = generateRotorPermutations(rotorIds);
  const emptyPlugboard: PlugboardCable = {};

  for (const perm of permutations) {
    for (const reflectorId of Object.keys(allReflectors).map(Number)) {
      const reflector = allReflectors[reflectorId];
      for (let p0 = 0; p0 < 26; p0++) {
        for (let p1 = 0; p1 < 26; p1++) {
          for (let p2 = 0; p2 < 26; p2++) {
            const rotors = [
              createRotorWithPosition(allRotors[perm[0]], p0),
              createRotorWithPosition(allRotors[perm[1]], p1),
              createRotorWithPosition(allRotors[perm[2]], p2),
            ];
            const encrypted = encryptString(
              knownPlaintext,
              rotors,
              emptyPlugboard,
              reflector,
            );
            if (encrypted === ciphertext.slice(0, knownPlaintext.length)) {
              results.push({
                rotorIds: perm,
                reflectorName: reflector.name,
                startingPositions: [p0, p1, p2],
              });
            }
          }
        }
      }
    }
  }

  return results;
};

const processPermutation = (
  perm: number[],
  ciphertext: string,
  knownPlaintext: string,
  allRotors: { [id: number]: RotorState },
  allReflectors: { [id: number]: ReflectorState },
): BruteForceResult[] => {
  const results: BruteForceResult[] = [];
  const emptyPlugboard: PlugboardCable = {};

  for (const reflectorId of Object.keys(allReflectors).map(Number)) {
    const reflector = allReflectors[reflectorId];
    for (let p0 = 0; p0 < 26; p0++) {
      for (let p1 = 0; p1 < 26; p1++) {
        for (let p2 = 0; p2 < 26; p2++) {
          const rotors = [
            createRotorWithPosition(allRotors[perm[0]], p0),
            createRotorWithPosition(allRotors[perm[1]], p1),
            createRotorWithPosition(allRotors[perm[2]], p2),
          ];
          const encrypted = encryptString(
            knownPlaintext,
            rotors,
            emptyPlugboard,
            reflector,
          );
          if (encrypted === ciphertext.slice(0, knownPlaintext.length)) {
            results.push({
              rotorIds: perm,
              reflectorName: reflector.name,
              startingPositions: [p0, p1, p2],
            });
          }
        }
      }
    }
  }

  return results;
};

export const bruteForceSearchAsync = (
  ciphertext: string,
  knownPlaintext: string,
  allRotors: { [id: number]: RotorState },
  allReflectors: { [id: number]: ReflectorState },
  onProgress: (progress: number) => void,
): Promise<BruteForceResult[]> => {
  const rotorIds = Object.keys(allRotors).map(Number);
  const permutations = generateRotorPermutations(rotorIds);
  const totalPerms = permutations.length;
  const allResults: BruteForceResult[] = [];

  return new Promise((resolve) => {
    let index = 0;

    const processNext = () => {
      if (index >= totalPerms) {
        onProgress(1);
        resolve(allResults);
        return;
      }

      const results = processPermutation(
        permutations[index],
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

    processNext();
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
