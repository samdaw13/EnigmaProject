import {FunctionComponent} from 'react';
import {View} from 'react-native';
import {Button, Modal, Text} from 'react-native-paper';
import {RotorSelectModalProps, RotorState} from '../../../../types';
import {rotorStyles} from '../../../../styles';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../../../store/store';
import {updateRotor} from '../../../../features/rotors/features';

export const RotorSelectModal: FunctionComponent<RotorSelectModalProps> = ({
  modalVisible,
  setModalVisible,
  setRotor,
  currentRotor,
}) => {
  const rotors = useSelector((state: RootState) => state.rotors.rotors);
  const dispatch = useDispatch();
  const closeModal = () => {
    setModalVisible(false);
  };
  const chooseRotor = (rotor: RotorState) => {
    dispatch(updateRotor({id: rotor.id, isAvailable: false}));
    if (currentRotor)
      dispatch(updateRotor({id: currentRotor.id, isAvailable: true}));
    setRotor(rotor);
    closeModal();
  };
  return (
    <Modal
      visible={modalVisible}
      onDismiss={closeModal}
      contentContainerStyle={rotorStyles.selectRotor}>
      <View>
        <Text>Choose a rotor</Text>
        {rotors
          .filter(rotor => rotor.isAvailable)
          .map(rotor => {
            return (
              <Button key={rotor.id} onPress={() => chooseRotor(rotor)}>
                {rotor.id}
              </Button>
            );
          })}
      </View>
    </Modal>
  );
};
