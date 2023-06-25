import React, { FunctionComponent } from 'react';
import { ScrollView, View } from 'react-native';
import { Button, Modal, Text } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';

import { updateRotorCurrentIndex } from '../../../../../features/rotors/features';
import { RootState } from '../../../../../store/store';
import { rotorStyles } from '../../../../../styles';
import { RotorSelectModalProps } from '../../../../../types';

export const ChangeIndexModal: FunctionComponent<RotorSelectModalProps> = ({
  modalVisible,
  setModalVisible,
  currentRotor,
  setRotor,
}) => {
  const rotors = useSelector((state: RootState) => state.rotors);
  const dispatch = useDispatch();
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
      setRotor(rotors[currentRotor.id]);
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
        <Text>Select new letter</Text>
        <ScrollView>
          {currentRotor &&
            currentRotor.config.displayedLetters.map((letter) => {
              return (
                <Button
                  key={`${letter}${currentRotor.id.toString()}`}
                  testID={`button${letter}${currentRotor.id.toString()}`}
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
