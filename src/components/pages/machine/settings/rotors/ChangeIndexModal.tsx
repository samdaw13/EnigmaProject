import type { FunctionComponent } from 'react';
import React, { useMemo } from 'react';
import { ScrollView, View } from 'react-native';
import { Button, Modal, Text } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';

import { SELECT_NEW_LETTER } from '../../../../../constants';
import { updateRotorCurrentIndex } from '../../../../../features/rotors/features';
import type { RootState } from '../../../../../store/store';
import { makeRotorStyles } from '../../../../../styles';
import { useThemeColors } from '../../../../../theme/useThemeColors';
import type { ChangeIndexModalProps } from '../../../../../types';
import { letterButton } from '../../../../../utils';

export const ChangeIndexModal: FunctionComponent<ChangeIndexModalProps> = ({
  modalVisible,
  setModalVisible,
  currentRotor,
  setRotor,
}) => {
  const rotors = useSelector((state: RootState) => state.rotors.available);
  const dispatch = useDispatch();
  const colors = useThemeColors();
  const rotorStyles = useMemo(() => makeRotorStyles(colors), [colors]);
  const closeModal = () => {
    setModalVisible(false);
  };
  const updateIndex = (letter: string) => {
    if (currentRotor) {
      dispatch(
        updateRotorCurrentIndex({
          id: currentRotor.id,
          currentIndex: currentRotor.config.displayedLetters.indexOf(letter),
        }),
      );
      setRotor(rotors[currentRotor.id] ?? null);
    }
    closeModal();
  };
  return (
    <Modal
      visible={modalVisible}
      onDismiss={closeModal}
      contentContainerStyle={rotorStyles.selectRotor}
    >
      <View>
        <Text style={rotorStyles.modalText}>{SELECT_NEW_LETTER}</Text>
        <ScrollView>
          {currentRotor &&
            currentRotor.config.displayedLetters.map((letter) => {
              return (
                <Button
                  key={`${letter}${currentRotor.id.toString()}`}
                  testID={letterButton(letter, currentRotor.id)}
                  mode='outlined'
                  textColor={colors.textPrimary}
                  style={{ borderColor: colors.border }}
                  onPress={() => updateIndex(letter)}
                >
                  {letter}
                </Button>
              );
            })}
        </ScrollView>
      </View>
    </Modal>
  );
};
