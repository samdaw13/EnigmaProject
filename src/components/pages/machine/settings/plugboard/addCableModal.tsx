import React, { FunctionComponent, useState, useEffect } from 'react';
import { View } from 'react-native';
import { Modal } from 'react-native-paper';
import { AddCableModalProps } from '../../../../../types';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../store/store';
import { SelectLetterButton } from './SelectLetterButton';
import { addCable } from '../../../../../features/plugboard';

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
  return (
    <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)}>
      <View>
        {inputLetter === null && (
          <SelectLetterButton
            setLetter={setInputLetter}
            displayText='Select input letter'
            availableLetters={availableLetters}
            setAvailableLetters={setAvailableLetters}
          />
        )}
        {inputLetter !== null && (
          <SelectLetterButton
            setLetter={setOutputLetter}
            displayText='Select output letter'
            availableLetters={availableLetters}
            setAvailableLetters={setAvailableLetters}
          />
        )}
      </View>
    </Modal>
  );
};
