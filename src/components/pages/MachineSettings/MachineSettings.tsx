import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { FunctionComponent } from 'react';
import React, { useCallback, useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Button, IconButton } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';

import {
  ALPHABET,
  CLEAR_BUTTON,
  CLEAR_SETTINGS,
  ENCRYPT_MESSAGE,
  ENCRYPT_MESSAGE_BUTTON,
  INFO_BUTTON,
  INFO_SETTINGS_CONTENT,
  INFO_SETTINGS_TITLE,
  RANDOMIZE_BUTTON,
  RANDOMIZE_SETTINGS,
} from '../../../constants';
import { addCable, clearPlugboard } from '../../../features/plugboard';
import {
  resetRotors,
  setSelectedRotor,
  updateRotorAvailability,
  updateRotorCurrentIndex,
} from '../../../features/rotors/features';
import type { RootState } from '../../../store/store';
import { useThemeColors } from '../../../theme/useThemeColors';
import type { NextScreenNavigationProp } from '../../../types';
import { InfoSidebar } from '../../molecules/InfoSidebar';
import { Plugboard } from '../../organisms/Plugboard';
import { Rotors } from '../../organisms/Rotors';
import { makeStyles } from './styles';

const ROTOR_IDS = [1, 2, 3, 4, 5];

const shuffleArray = <T,>(arr: T[]): T[] => {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j]!, result[i]!];
  }
  return result;
};

export const MachineSettings: FunctionComponent = () => {
  const navigation = useNavigation<NextScreenNavigationProp>();
  const colors = useThemeColors();
  const { bottom: bottomInset } = useSafeAreaInsets();
  const styles = useMemo(
    () => makeStyles(colors, bottomInset),
    [colors, bottomInset],
  );
  const [infoVisible, setInfoVisible] = useState(false);
  const dispatch = useDispatch();
  const selectedSlots = useSelector(
    (state: RootState) => state.rotors.selectedSlots,
  );
  const allRotorsSelected = selectedSlots.every((id) => id !== null);

  useFocusEffect(
    useCallback(() => {
      navigation.getParent()?.setOptions({
        headerRight: () => (
          <IconButton
            testID={INFO_BUTTON}
            icon='information'
            iconColor={colors.textSecondary}
            size={22}
            onPress={() => setInfoVisible(true)}
          />
        ),
      });
    }, [navigation, colors.textSecondary, setInfoVisible]),
  );

  const navigateToNextItem = () => {
    navigation.navigate('Keyboard');
  };

  const clearSettings = () => {
    dispatch(resetRotors());
    dispatch(clearPlugboard());
  };

  const randomizeSettings = () => {
    dispatch(resetRotors());
    dispatch(clearPlugboard());

    const selectedIds = shuffleArray(ROTOR_IDS).slice(0, 3);
    selectedIds.forEach((rotorId, slotIndex) => {
      dispatch(updateRotorAvailability({ id: rotorId, isAvailable: false }));
      dispatch(setSelectedRotor({ slotIndex, rotorId }));
      dispatch(
        updateRotorCurrentIndex({
          id: rotorId,
          currentIndex: Math.floor(Math.random() * 26),
        }),
      );
    });

    const letters = shuffleArray([...ALPHABET]);
    const numCables = 3 + Math.floor(Math.random() * 3);
    for (let i = 0; i < numCables * 2; i += 2) {
      dispatch(
        addCable({ inputLetter: letters[i]!, outputLetter: letters[i + 1]! }),
      );
    }
  };

  return (
    <View style={styles.screen}>
      <ScrollView style={styles.content}>
        <Rotors />
        <Plugboard />
      </ScrollView>
      <View style={styles.bottomSection}>
        <View style={styles.buttonRow}>
          <Button
            testID={CLEAR_BUTTON}
            mode='outlined'
            textColor={colors.textPrimary}
            style={[{ borderColor: colors.border }, styles.rowButton]}
            onPress={clearSettings}
          >
            {CLEAR_SETTINGS}
          </Button>
          <Button
            testID={RANDOMIZE_BUTTON}
            mode='outlined'
            textColor={colors.textPrimary}
            style={[{ borderColor: colors.border }, styles.rowButton]}
            onPress={randomizeSettings}
          >
            {RANDOMIZE_SETTINGS}
          </Button>
        </View>
        <Button
          mode='contained'
          onPress={navigateToNextItem}
          testID={ENCRYPT_MESSAGE_BUTTON}
          buttonColor={colors.accent}
          textColor={colors.background}
          disabled={!allRotorsSelected}
          theme={{
            colors: {
              surfaceDisabled: colors.disabledSurface,
              onSurfaceDisabled: colors.disabledText,
            },
          }}
        >
          {ENCRYPT_MESSAGE}
        </Button>
      </View>
      <InfoSidebar
        visible={infoVisible}
        onDismiss={() => setInfoVisible(false)}
        title={INFO_SETTINGS_TITLE}
        content={INFO_SETTINGS_CONTENT}
      />
    </View>
  );
};
