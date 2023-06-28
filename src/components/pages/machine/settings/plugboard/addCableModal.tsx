import React, { FunctionComponent, useEffect, useState } from 'react';
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
import { RootState } from '../../../../../store/store';
import { AddCableModalProps } from '../../../../../types';
import { SelectLetterButton } from './SelectLetterButton';
import { rotorStyles } from '../../../../../styles';

export const AddCableModal: FunctionComponent<AddCableModalProps> = ({
  modalVisible,
  setModalVisible,
}) => {
  const plugboard = useSelector((state: RootState) => state.plugboard);
  const [availableLetters, setAvailableLetters] = useState<string[]>(
    [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'].filter(
      (letter) => !JSON.stringify(plugboard).includes(letter),
    ),
  );
  const [inputLetter, setInputLetter] = useState<null | string>(null);
  const [outputLetter, setOutputLetter] = useState<null | string>(null);
  const dispatch = useDispatch();
  useEffect(() => {
    if (inputLetter !== null && outputLetter !== null) {
      dispatch(
        addCable({
          inputLetter,
          outputLetter,
        }),
      );
      setModalVisible(false);
      setInputLetter(null);
      setOutputLetter(null);
    }
  }, [inputLetter, outputLetter]);
  useEffect(() => {
    setAvailableLetters([...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'].filter(
      (letter) => !JSON.stringify(plugboard).includes(letter),
    ))
  }, [plugboard])
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
            setAvailableLetters={setAvailableLetters}
            testID={SELECT_INPUT_LETTER}
          />
        )}
        {inputLetter !== null && (
          <SelectLetterButton
            setLetter={setOutputLetter}
            displayText={SELECT_OUTPUT_LETTER_DISPLAY}
            availableLetters={availableLetters}
            setAvailableLetters={setAvailableLetters}
            testID={SELECT_OUTPUT_LETTER}
          />
        )}
      </View>
    </Modal>
  );
};
