import type { FunctionComponent } from 'react';
import React, { useMemo, useState } from 'react';
import { View } from 'react-native';
import { Modal } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';

import {
  SELECT_INPUT_LETTER,
  SELECT_INPUT_LETTER_DISPLAY,
  SELECT_OUTPUT_LETTER,
  SELECT_OUTPUT_LETTER_DISPLAY,
} from '../../../../../constants';
import { addCable } from '../../../../../features/plugboard';
import type { RootState } from '../../../../../store/store';
import { makeRotorStyles } from '../../../../../styles';
import { useThemeColors } from '../../../../../theme/useThemeColors';
import type { AddCableModalProps } from '../../../../../types';
import { SelectLetterButton } from './SelectLetterButton';

export const AddCableModal: FunctionComponent<AddCableModalProps> = ({
  modalVisible,
  setModalVisible,
}) => {
  const plugboard = useSelector((state: RootState) => state.plugboard);
  const [inputLetter, setInputLetter] = useState<string | null>(null);
  const dispatch = useDispatch();
  const colors = useThemeColors();
  const rotorStyles = useMemo(() => makeRotorStyles(colors), [colors]);

  const availableLetters = useMemo(
    () =>
      [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'].filter(
        (letter) => !JSON.stringify(plugboard).includes(letter),
      ),
    [plugboard],
  );

  const availableOutputLetters = useMemo(
    () => availableLetters.filter((letter) => letter !== inputLetter),
    [availableLetters, inputLetter],
  );

  const handleOutputLetterSelect = (letter: string) => {
    dispatch(addCable({ inputLetter: inputLetter!, outputLetter: letter }));
    setModalVisible(false);
    setInputLetter(null);
  };
  return (
    <Modal
      visible={modalVisible}
      onDismiss={() => setModalVisible(false)}
      contentContainerStyle={rotorStyles.selectRotor}
    >
      <View>
        {inputLetter === null && (
          <SelectLetterButton
            setLetter={setInputLetter}
            displayText={SELECT_INPUT_LETTER_DISPLAY}
            availableLetters={availableLetters}
            setAvailableLetters={() => {}}
            testID={SELECT_INPUT_LETTER}
          />
        )}
        {inputLetter !== null && (
          <SelectLetterButton
            setLetter={handleOutputLetterSelect}
            displayText={SELECT_OUTPUT_LETTER_DISPLAY}
            availableLetters={availableOutputLetters}
            setAvailableLetters={() => {}}
            testID={SELECT_OUTPUT_LETTER}
          />
        )}
      </View>
    </Modal>
  );
};
