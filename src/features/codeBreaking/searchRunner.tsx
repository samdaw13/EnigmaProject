import { PermissionsAndroid, Platform } from 'react-native';
import BackgroundService from 'react-native-background-actions';

import { cribSearchAsync } from '../../codebreaking';
import type { AppDispatch } from '../../store/store';
import { initialReflectorState } from '../reflector';
import { initialRotorState } from '../rotors/features';
import { cribSearchCompleted, progressUpdated, searchStarted } from '.';

interface BackgroundTaskData {
  ciphertext: string;
  crib: string;
  knownCribPosition?: number;
}

let cancelled = false;
let dispatch: AppDispatch | null = null;

export const cancelSearch = (): void => {
  cancelled = true;
  if (BackgroundService.isRunning()) {
    void BackgroundService.stop();
  }
};

const isCancelled = (): boolean => cancelled;

const updateNotificationProgress = (progress: number): void => {
  if (!BackgroundService.isRunning()) return;

  void BackgroundService.updateNotification({
    taskDesc: `Searching... ${Math.round(progress * 100)}%`,
    progressBar: {
      value: Math.round(progress * 100),
      max: 100,
      indeterminate: false,
    },
  });
};

const requestNotificationPermission = async (): Promise<void> => {
  if (Platform.OS !== 'android' || Platform.Version < 33) return;
  await PermissionsAndroid.request(
    'android.permission.POST_NOTIFICATIONS' as typeof PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
  );
};

const backgroundTask = async (taskData?: BackgroundTaskData): Promise<void> => {
  if (taskData === undefined || dispatch === null) return;

  const results = await cribSearchAsync(
    taskData.ciphertext,
    taskData.crib,
    initialRotorState.available,
    initialReflectorState.reflectors,
    (p) => {
      dispatch!(progressUpdated(p));
      updateNotificationProgress(p);
    },
    isCancelled,
    taskData.knownCribPosition,
  );

  if (!cancelled) {
    dispatch(
      cribSearchCompleted({
        results,
        ciphertext: taskData.ciphertext,
        crib: taskData.crib,
      }),
    );
  }

  if (BackgroundService.isRunning()) {
    await BackgroundService.stop();
  }
};

const runSearchOnAndroid = (
  ciphertext: string,
  crib: string,
  appDispatch: AppDispatch,
  knownCribPosition?: number,
): void => {
  dispatch = appDispatch;

  const taskOptions = {
    taskName: 'CribSearch',
    taskTitle: 'Enigma Crib Search',
    taskDesc: 'Starting search...',
    taskIcon: { name: 'ic_launcher', type: 'mipmap' as const },
    color: '#6200ee',
    parameters: {
      ciphertext,
      crib,
      ...(knownCribPosition !== undefined && { knownCribPosition }),
    },
    progressBar: {
      max: 100,
      indeterminate: false,
      value: 0,
    },
    linkingURI: 'enigma://search',
  };

  void requestNotificationPermission().then(() => {
    void BackgroundService.start(backgroundTask, taskOptions);
  });
};

const runSearchOnIos = (
  ciphertext: string,
  crib: string,
  appDispatch: AppDispatch,
  knownCribPosition?: number,
): void => {
  void cribSearchAsync(
    ciphertext,
    crib,
    initialRotorState.available,
    initialReflectorState.reflectors,
    (p) => appDispatch(progressUpdated(p)),
    isCancelled,
    knownCribPosition,
  ).then((results) => {
    if (!cancelled) {
      appDispatch(cribSearchCompleted({ results, ciphertext, crib }));
    }
  });
};

export const runCribAnalysis = (
  ciphertext: string,
  crib: string,
  appDispatch: AppDispatch,
  knownCribPosition?: number,
): void => {
  cancelled = false;
  appDispatch(searchStarted());

  if (Platform.OS === 'android') {
    runSearchOnAndroid(ciphertext, crib, appDispatch, knownCribPosition);
  } else {
    runSearchOnIos(ciphertext, crib, appDispatch, knownCribPosition);
  }
};
