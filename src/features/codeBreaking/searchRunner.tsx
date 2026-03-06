import type { AppDispatch } from '../../store/store';
import { cribSearchAsync } from '../../utils/codebreaking';
import { initialReflectorState } from '../reflector';
import { initialRotorState } from '../rotors/features';
import { cribSearchCompleted, progressUpdated, searchStarted } from '.';

let cancelled = false;

export const cancelSearch = (): void => {
  cancelled = true;
};

const isCancelled = (): boolean => cancelled;

export const runCribAnalysis = (
  ciphertext: string,
  crib: string,
  dispatch: AppDispatch,
): void => {
  cancelled = false;
  dispatch(searchStarted());
  void cribSearchAsync(
    ciphertext,
    crib,
    initialRotorState.available,
    initialReflectorState.reflectors,
    (p) => dispatch(progressUpdated(p)),
    isCancelled,
  ).then((results) => {
    if (!cancelled)
      dispatch(cribSearchCompleted({ results, ciphertext, crib }));
  });
};
