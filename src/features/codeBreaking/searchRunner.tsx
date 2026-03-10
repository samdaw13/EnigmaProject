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

export const cancelSearch = (): void => {
  cancelled = true;
  if (BackgroundService.isRunning()) {
    void BackgroundService.stop();
  }
};

const isCancelled = (): boolean => cancelled || !BackgroundService.isRunning();

const runSearchInBackground = (
  ciphertext: string,
  crib: string,
  dispatch: AppDispatch,
  knownCribPosition?: number,
): void => {
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
  };

  const backgroundTask = async (
    taskData?: BackgroundTaskData,
  ): Promise<void> => {
    if (taskData === undefined) return;

    const results = await cribSearchAsync(
      taskData.ciphertext,
      taskData.crib,
      initialRotorState.available,
      initialReflectorState.reflectors,
      (p) => {
        dispatch(progressUpdated(p));
        void BackgroundService.updateNotification({
          taskDesc: `Searching... ${Math.round(p * 100)}%`,
        });
      },
      isCancelled,
      taskData.knownCribPosition,
      true,
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

  void requestNotificationPermission().then(() => {
    void BackgroundService.start(backgroundTask, taskOptions);
  });
};

const requestNotificationPermission = async (): Promise<void> => {
  if (Platform.OS !== 'android' || Platform.Version < 33) return;
  await PermissionsAndroid.request(
    'android.permission.POST_NOTIFICATIONS' as typeof PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
  );
};

const runSearchInForeground = (
  ciphertext: string,
  crib: string,
  dispatch: AppDispatch,
  knownCribPosition?: number,
): void => {
  const foregroundIsCancelled = (): boolean => cancelled;

  void cribSearchAsync(
    ciphertext,
    crib,
    initialRotorState.available,
    initialReflectorState.reflectors,
    (p) => dispatch(progressUpdated(p)),
    foregroundIsCancelled,
    knownCribPosition,
  ).then((results) => {
    if (!cancelled)
      dispatch(cribSearchCompleted({ results, ciphertext, crib }));
  });
};

export const runCribAnalysis = (
  ciphertext: string,
  crib: string,
  dispatch: AppDispatch,
  knownCribPosition?: number,
): void => {
  cancelled = false;
  dispatch(searchStarted());

  if (Platform.OS === 'android') {
    runSearchInBackground(ciphertext, crib, dispatch, knownCribPosition);
  } else {
    runSearchInForeground(ciphertext, crib, dispatch, knownCribPosition);
  }
};
