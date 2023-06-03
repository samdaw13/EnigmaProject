import React, { FunctionComponent } from 'react';
import { View, ScrollView } from 'react-native';
import { Button, Modal, Text } from 'react-native-paper';
import { RotorSelectModalProps } from '../../../../types';
import { rotorStyles } from '../../../../styles';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../store/store';
import { updateRotor } from '../../../../features/rotors/features';

export const ChangeIndexModal: FunctionComponent<RotorSelectModalProps> = ({
  modalVisible,
  setModalVisible,
  currentRotor,
  setRotor,
}) => {
  const rotors = useSelector((state: RootState) => state.rotors.rotors);
  const dispatch = useDispatch();
  const closeModal = () => {
    setModalVisible(false);
  };
  const updateIndex = (letter: string) => {
    if (currentRotor) {
      dispatch(
        updateRotor({
          id: currentRotor.id,
          currentIndex: currentRotor.config.displayedLetters.indexOf(letter),
        }),
      );
    }
    rotors.forEach((rotor) => {
      if (rotor.id === currentRotor?.id) {
        const tempRotor = rotor;
        setRotor(tempRotor);
      }
    });
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
