import { useNavigation } from '@react-navigation/native';
import type { FunctionComponent } from 'react';
import React, { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, IconButton } from 'react-native-paper';
import { useDispatch } from 'react-redux';

import {
  ENCRYPT_MESSAGE,
  ENCRYPT_MESSAGE_BUTTON,
  INFO_BUTTON,
  INFO_SETTINGS_CONTENT,
  INFO_SETTINGS_TITLE,
  RANDOMIZE_BUTTON,
  RANDOMIZE_SETTINGS,
} from '../../../../constants';
import { addCable, clearPlugboard } from '../../../../features/plugboard';
import {
  resetRotors,
  setSelectedRotor,
  updateRotorAvailability,
  updateRotorCurrentIndex,
} from '../../../../features/rotors/features';
import type { ColorPalette } from '../../../../theme/colors';
import { useThemeColors } from '../../../../theme/useThemeColors';
import type { NextScreenNavigationProp } from '../../../../types';
import { InfoSidebar } from '../../../InfoSidebar';
import { Plugboard } from './plugboard';
import { Rotors } from './rotors';

const ROTOR_IDS = [1, 2, 3, 4, 5];
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const shuffleArray = <T,>(arr: T[]): T[] => {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

const makeStyles = (colors: ColorPalette) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.background,
    },
    bottomRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 8,
    },
    infoButton: {
      position: 'absolute',
      right: 0,
      top: 0,
      zIndex: 1,
    },
  });

export const Settings: FunctionComponent = () => {
  const navigation = useNavigation<NextScreenNavigationProp>();
  const colors = useThemeColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const [infoVisible, setInfoVisible] = useState(false);
  const dispatch = useDispatch();

  const navigateToNextItem = () => {
    navigation.navigate('Keyboard');
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
        addCable({ inputLetter: letters[i], outputLetter: letters[i + 1] }),
      );
    }
  };

  return (
    <View style={styles.screen}>
      <IconButton
        testID={INFO_BUTTON}
        icon='information'
        iconColor={colors.textSecondary}
        size={22}
        style={styles.infoButton}
        onPress={() => setInfoVisible(true)}
      />
      <Rotors />
      <Plugboard />
      <View style={styles.bottomRow}>
        <Button
          testID={RANDOMIZE_BUTTON}
          mode='outlined'
          textColor={colors.textPrimary}
          style={{ borderColor: colors.border }}
          onPress={randomizeSettings}
        >
          {RANDOMIZE_SETTINGS}
        </Button>
        <Button
          mode='contained'
          onPress={navigateToNextItem}
          testID={ENCRYPT_MESSAGE_BUTTON}
          buttonColor={colors.accent}
          textColor={colors.background}
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
