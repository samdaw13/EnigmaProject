import React, { FunctionComponent, useEffect, useState } from 'react';

import { View } from 'react-native';
import { Button, Card, Portal, IconButton } from 'react-native-paper';
import { rotorStyles } from '../../../../../styles';
import { RotorSelectModal } from './RotorSelectModal';
import { RotorState } from '../../../../../types';
import { useDispatch, useSelector } from 'react-redux';
import { updateRotorAvailability } from '../../../../../features/rotors/features';
import { ChangeIndexModal } from './ChangeIndexModal';
import { RootState } from '../../../../../store/store';

export const Rotor: FunctionComponent = () => {
  const rotors = useSelector((state: RootState) => state.rotors);
  const [selectedRotor, setSelectedRotor] = useState<RotorState | null>(null);
  const [isSelectModalOpen, setIsSelectModalOpen] = useState(false);
  const [isChangeIndexModalOpen, setIsChangeIndexModalOpen] = useState(false);
  const dispatch = useDispatch();
  const setRotor = () => {
    setIsSelectModalOpen(true);
  };
  const removeRotor = () => {
    if (selectedRotor)
      dispatch(
        updateRotorAvailability({ id: selectedRotor.id, isAvailable: true }),
      );
    setSelectedRotor(null);
  };
  useEffect(() => {
    if (selectedRotor) {
      setSelectedRotor(rotors[selectedRotor.id]);
    }
  }, [rotors]);
  return (
    <View>
      <Portal>
        <RotorSelectModal
          modalVisible={isSelectModalOpen}
          setModalVisible={setIsSelectModalOpen}
          setRotor={setSelectedRotor}
          currentRotor={selectedRotor}
        />
        {selectedRotor && (
          <ChangeIndexModal
            modalVisible={isChangeIndexModalOpen}
            setModalVisible={setIsChangeIndexModalOpen}
            setRotor={setSelectedRotor}
            currentRotor={selectedRotor}
          />
        )}
      </Portal>
      <Card style={rotorStyles.rotor} contentStyle={{ paddingHorizontal: 0 }}>
        {selectedRotor && (
          <>
            <Card.Title
              title={`Current letter: ${
                selectedRotor.config.displayedLetters[
                  selectedRotor.config.currentIndex
                ]
              }`}
              subtitle={`Active rotor: ${selectedRotor.id}`}
              style={rotorStyles.cardComponent}
              right={() => (
                <IconButton
                  testID='removeRotor'
                  icon='close-circle'
                  mode='contained-tonal'
                  iconColor='#9c2a2a'
                  onPress={removeRotor}
                />
              )}
            />
            <Card.Actions style={rotorStyles.cardComponent}>
              <Button testID='replaceRotorBtn' onPress={setRotor}>
                Replace rotor
              </Button>
              <Button
                testID='changeLetterBtn'
                onPress={() => setIsChangeIndexModalOpen(true)}
              >
                Change current letter
              </Button>
            </Card.Actions>
          </>
        )}
        {selectedRotor === null && (
          <Card.Title
            title='No rotor selected'
            style={rotorStyles.cardComponent}
            right={() => (
              <Button
                mode='contained'
                testID='selectRotorBtn'
                onPress={setRotor}
              >
                Select rotor
              </Button>
            )}
          />
        )}
      </Card>
    </View>
  );
};
