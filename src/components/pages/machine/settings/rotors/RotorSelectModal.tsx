import React, { FunctionComponent } from 'react';
import { View } from 'react-native';
import { Button, Modal, Text } from 'react-native-paper';
import { RotorSelectModalProps, RotorState } from '../../../../../types';
import { rotorStyles } from '../../../../../styles';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../store/store';
import { updateRotorAvailability } from '../../../../../features/rotors/features';

export const RotorSelectModal: FunctionComponent<RotorSelectModalProps> = ({
  modalVisible,
  setModalVisible,
  setRotor,
  currentRotor,
}) => {
  const rotors = useSelector((state: RootState) => state.rotors);
  const dispatch = useDispatch();
  const closeModal = () => {
    setModalVisible(false);
  };
  const chooseRotor = (rotor: RotorState) => {
    dispatch(updateRotorAvailability({ id: rotor.id, isAvailable: false }));
    if (currentRotor)
      dispatch(
        updateRotorAvailability({ id: currentRotor.id, isAvailable: true }),
      );
    setRotor(rotor);
    closeModal();
  };

  return (
    <Modal
      visible={modalVisible}
      onDismiss={closeModal}
      contentContainerStyle={rotorStyles.selectRotor}
      testID='rotorSelectModal'
    >
      <View>
        <Text>Select rotor</Text>
        {Object.keys(rotors)
          .filter((key) => rotors[parseInt(key)].isAvailable)
          .map((key) => {
            const rotor = rotors[parseInt(key)];
            return (
              <Button
                key={rotor.id}
                testID={`selectRotorBtn${rotor.id}`}
                onPress={() => chooseRotor(rotor)}
              >
                {rotor.id}
              </Button>
            );
          })}
      </View>
    </Modal>
  );
};
