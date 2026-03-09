import type {
  PlugboardCable,
  ReflectorState,
  RotorState,
} from '../types/interfaces';
import { encryptLetter, stepRotors } from '../utils/enigma';
import { nlpConfidence } from '../utils/nlp';
import type { MenuAdjInt } from './crib-analysis';
import {
  allocateBfsBuffers,
  buildMenuAdjInt,
  findCribPositions,
  propagateIntHypothesis,
  steckerIntToPlugboard,
  steckerVerifiesCrib,
} from './crib-analysis';
import type { RotorIntTables } from './enigma-int';
import {
  ALPHABET_SIZE,
  buildReflectorIntMap,
  buildRotorIntTables,
  computeScramblerEntry,
  intStepRotors,
  stringToIndexArray,
} from './enigma-int';

export interface CribSearchResult {
  rotorIds: number[];
  reflectorName: string;
  startingPositions: number[];
  cribPosition: number;
  decryptedText: string;
  nlpScore: number;
  derivedPlugboard: PlugboardCable;
}

const MAX_CRIB_RESULTS = 100;

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

interface SearchContext {
  ciphertext: string;
  crib: string;
  cribCodes: Uint8Array;
  validPositions: number[];
  permutations: number[][];
  reflectorIds: number[];
  allRotors: { [id: number]: RotorState };
  allReflectors: { [id: number]: ReflectorState };
  rotorIntTables: { [id: number]: RotorIntTables };
  reflectorIntMaps: { [id: number]: Uint8Array };
  menusArray: MenuAdjInt[];
  segCodesArray: Uint8Array[];
  neededScramblerSteps: number[];
  maxStep: number;
  scramblerSlots: Uint8Array[];
  posScramblerFlat: Uint8Array;
  stecker: Int8Array;
  queueBuf: Int16Array;
  rPos: Uint8Array;
  mPos: Uint8Array;
  lPos: Uint8Array;
  stepOut: Uint8Array;
}

const buildSearchContext = (
  ciphertext: string,
  crib: string,
  allRotors: { [id: number]: RotorState },
  allReflectors: { [id: number]: ReflectorState },
  validPositions: number[],
): SearchContext => {
  const rotorIds = Object.keys(allRotors).map(Number);
  const permutations = generateRotorPermutations(rotorIds);
  const reflectorIds = Object.keys(allReflectors).map(Number);

  const rotorIntTables: { [id: number]: RotorIntTables } = {};
  for (const id of rotorIds) {
    rotorIntTables[id] = buildRotorIntTables(allRotors[id]!);
  }

  const reflectorIntMaps: { [id: number]: Uint8Array } = {};
  for (const id of reflectorIds) {
    reflectorIntMaps[id] = buildReflectorIntMap(allReflectors[id]!);
  }

  const cribCodes = stringToIndexArray(crib);

  const menusArray: MenuAdjInt[] = [];
  const segCodesArray: Uint8Array[] = [];
  for (const pos of validPositions) {
    const segment = ciphertext.slice(pos, pos + crib.length);
    menusArray.push(buildMenuAdjInt(crib, segment));
    segCodesArray.push(
      stringToIndexArray(ciphertext.slice(pos, pos + crib.length)),
    );
  }

  const neededScramblerStepSet = new Set<number>();
  for (const pos of validPositions) {
    for (let i = 0; i < crib.length; i++) {
      neededScramblerStepSet.add(pos + i + 1);
    }
  }
  const neededScramblerSteps = [...neededScramblerStepSet];
  const maxStep = Math.max(...neededScramblerSteps);

  const rPos = new Uint8Array(maxStep + 1);
  const mPos = new Uint8Array(maxStep + 1);
  const lPos = new Uint8Array(maxStep + 1);
  const stepOut = new Uint8Array(3);
  const scramblerSlots: Uint8Array[] = Array.from(
    { length: maxStep + 1 },
    () => new Uint8Array(ALPHABET_SIZE),
  );
  const posScramblerFlat = new Uint8Array(crib.length * ALPHABET_SIZE);
  const { stecker, queueBuf } = allocateBfsBuffers();

  return {
    ciphertext,
    crib,
    cribCodes,
    validPositions,
    permutations,
    reflectorIds,
    allRotors,
    allReflectors,
    rotorIntTables,
    reflectorIntMaps,
    menusArray,
    segCodesArray,
    neededScramblerSteps,
    maxStep,
    scramblerSlots,
    posScramblerFlat,
    stecker,
    queueBuf,
    rPos,
    mPos,
    lPos,
    stepOut,
  };
};

const computeAllRotorPositions = (
  p0: number,
  p1: number,
  p2: number,
  maxStep: number,
  rStep: number,
  mStep: number,
  rPos: Uint8Array,
  mPos: Uint8Array,
  lPos: Uint8Array,
  stepOut: Uint8Array,
): void => {
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
};

const precomputeScramblerLookups = (
  ctx: SearchContext,
  rFwd: Uint8Array,
  mFwd: Uint8Array,
  lFwd: Uint8Array,
  rInv: Uint8Array,
  mInv: Uint8Array,
  lInv: Uint8Array,
  reflMap: Uint8Array,
): void => {
  for (let si = 0; si < ctx.neededScramblerSteps.length; si++) {
    const step = ctx.neededScramblerSteps[si]!;
    const slot = ctx.scramblerSlots[step]!;
    const ro = ctx.rPos[step]!;
    const mo = ctx.mPos[step]!;
    const lo = ctx.lPos[step]!;
    for (let j = 0; j < ALPHABET_SIZE; j++) {
      slot[j] = computeScramblerEntry(
        j,
        ro,
        mo,
        lo,
        rFwd,
        mFwd,
        lFwd,
        rInv,
        mInv,
        lInv,
        reflMap,
      );
    }
  }
};

const testCribPosition = (ctx: SearchContext, pi: number): Int8Array | null => {
  const pos = ctx.validPositions[pi]!;
  const menu = ctx.menusArray[pi]!;
  const segCodes = ctx.segCodesArray[pi]!;

  for (let i = 0; i < ctx.crib.length; i++) {
    ctx.posScramblerFlat.set(
      ctx.scramblerSlots[pos + i + 1]!,
      i * ALPHABET_SIZE,
    );
  }

  for (let hypothesis = 0; hypothesis < ALPHABET_SIZE; hypothesis++) {
    if (
      !propagateIntHypothesis(
        menu.testLetter,
        hypothesis,
        menu.adjOther,
        menu.adjStep,
        ctx.posScramblerFlat,
        ctx.stecker,
        ctx.queueBuf,
      )
    ) {
      continue;
    }

    if (
      !steckerVerifiesCrib(
        ctx.stecker,
        segCodes,
        ctx.cribCodes,
        ctx.posScramblerFlat,
      )
    ) {
      continue;
    }

    return ctx.stecker;
  }

  return null;
};

const collectResult = (
  ctx: SearchContext,
  stecker: Int8Array,
  perm: number[],
  rId: number,
  mId: number,
  lId: number,
  p0: number,
  p1: number,
  p2: number,
  pos: number,
  reflector: ReflectorState,
): CribSearchResult => {
  const derivedPlugboard = steckerIntToPlugboard(stecker);
  const fullRotors = [
    createRotorWithPosition(ctx.allRotors[rId]!, p0),
    createRotorWithPosition(ctx.allRotors[mId]!, p1),
    createRotorWithPosition(ctx.allRotors[lId]!, p2),
  ];
  const decryptedText = encryptString(
    ctx.ciphertext,
    fullRotors,
    derivedPlugboard,
    reflector,
  );
  return {
    rotorIds: perm,
    reflectorName: reflector.name,
    startingPositions: [p0, p1, p2],
    cribPosition: pos,
    decryptedText,
    nlpScore: nlpConfidence(decryptedText),
    derivedPlugboard,
  };
};

export const cribSearchAsync = (
  ciphertext: string,
  crib: string,
  allRotors: { [id: number]: RotorState },
  allReflectors: { [id: number]: ReflectorState },
  onProgress: (progress: number) => void,
  isCancelled?: () => boolean,
  knownCribPosition?: number,
): Promise<CribSearchResult[]> => {
  const validPositions =
    knownCribPosition !== undefined
      ? [knownCribPosition]
      : findCribPositions(ciphertext, crib);

  if (validPositions.length === 0) {
    onProgress(1);
    return Promise.resolve([]);
  }

  const ctx = buildSearchContext(
    ciphertext,
    crib,
    allRotors,
    allReflectors,
    validPositions,
  );

  const allResults: CribSearchResult[] = [];
  const totalTicks =
    ctx.permutations.length * ctx.reflectorIds.length * ALPHABET_SIZE;

  return new Promise((resolve) => {
    let permIndex = 0;
    let reflIndex = 0;
    let p0 = 0;
    let ticksDone = 0;

    const seedTables =
      ctx.rotorIntTables[Object.keys(allRotors).map(Number)[0]!]!;
    let cachedPermIndex = -1;
    let rId = 0,
      mId = 0,
      lId = 0;
    let rStep = 0,
      mStep = 0;
    let rFwd = seedTables.fwd,
      rInv = seedTables.inv;
    let mFwd = seedTables.fwd,
      mInv = seedTables.inv;
    let lFwd = seedTables.fwd,
      lInv = seedTables.inv;

    const syncPermCache = () => {
      if (permIndex === cachedPermIndex) return;
      cachedPermIndex = permIndex;
      [rId, mId, lId] = ctx.permutations[permIndex]! as [
        number,
        number,
        number,
      ];
      rStep = allRotors[rId]!.config.stepIndex;
      mStep = allRotors[mId]!.config.stepIndex;
      rFwd = ctx.rotorIntTables[rId]!.fwd;
      rInv = ctx.rotorIntTables[rId]!.inv;
      mFwd = ctx.rotorIntTables[mId]!.fwd;
      mInv = ctx.rotorIntTables[mId]!.inv;
      lFwd = ctx.rotorIntTables[lId]!.fwd;
      lInv = ctx.rotorIntTables[lId]!.inv;
    };

    const processSlice = () => {
      if (isCancelled?.() === true) {
        resolve([]);
        return;
      }

      if (permIndex >= ctx.permutations.length) {
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

      syncPermCache();

      const reflectorId = ctx.reflectorIds[reflIndex]!;
      const reflMap = ctx.reflectorIntMaps[reflectorId]!;
      const reflector = allReflectors[reflectorId]!;
      const perm = ctx.permutations[permIndex]!;

      for (let p1 = 0; p1 < ALPHABET_SIZE; p1++) {
        for (let p2 = 0; p2 < ALPHABET_SIZE; p2++) {
          computeAllRotorPositions(
            p0,
            p1,
            p2,
            ctx.maxStep,
            rStep,
            mStep,
            ctx.rPos,
            ctx.mPos,
            ctx.lPos,
            ctx.stepOut,
          );

          precomputeScramblerLookups(
            ctx,
            rFwd,
            mFwd,
            lFwd,
            rInv,
            mInv,
            lInv,
            reflMap,
          );

          for (let pi = 0; pi < validPositions.length; pi++) {
            const matchedStecker = testCribPosition(ctx, pi);
            if (matchedStecker) {
              allResults.push(
                collectResult(
                  ctx,
                  matchedStecker,
                  perm,
                  rId,
                  mId,
                  lId,
                  p0,
                  p1,
                  p2,
                  validPositions[pi]!,
                  reflector,
                ),
              );
              break;
            }
          }
        }
      }

      ticksDone++;
      p0++;
      if (p0 >= ALPHABET_SIZE) {
        p0 = 0;
        reflIndex++;
        if (reflIndex >= ctx.reflectorIds.length) {
          reflIndex = 0;
          permIndex++;
        }
      }
      onProgress(ticksDone / totalTicks);

      setTimeout(processSlice, 0);
    };

    setTimeout(processSlice, 0);
  });
};
