import React, { FunctionComponent, useEffect, useState } from 'react';
import { View } from 'react-native';
import { Button, Card, IconButton, Portal } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';

import {
  CHANGE_CURRENT_LETTER,
  CHANGE_LETTER_BUTTON,
  NO_ROTOR_SELECTED,
  REMOVE_ROTOR_BUTTON,
  REPLACE_ROTOR,
  REPLACE_ROTOR_BUTTON,
  SELECT_ROTOR,
  SET_ROTOR_BUTTON,
} from '../../../../../constants';
import { updateRotorAvailability } from '../../../../../features/rotors/features';
import { RootState } from '../../../../../store/store';
import { rotorStyles } from '../../../../../styles';
import { RotorState } from '../../../../../types';
import { currentLetter, currentRotor } from '../../../../../utils';
import { ChangeIndexModal } from './ChangeIndexModal';
import { RotorSelectModal } from './RotorSelectModal';

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
              title={currentLetter(
                selectedRotor.config.displayedLetters[
                  selectedRotor.config.currentIndex
                ],
              )}
              subtitle={currentRotor(selectedRotor.id)}
              style={rotorStyles.cardComponent}
              right={() => (
                <IconButton
                  testID={REMOVE_ROTOR_BUTTON}
                  icon='close-circle'
                  mode='contained-tonal'
                  iconColor='#9c2a2a'
                  onPress={removeRotor}
                />
              )}
            />
            <Card.Actions style={rotorStyles.cardComponent}>
              <Button testID={REPLACE_ROTOR_BUTTON} onPress={setRotor}>
                {REPLACE_ROTOR}
              </Button>
              <Button
                testID={CHANGE_LETTER_BUTTON}
                onPress={() => setIsChangeIndexModalOpen(true)}
              >
                {CHANGE_CURRENT_LETTER}
              </Button>
            </Card.Actions>
          </>
        )}
        {selectedRotor === null && (
          <Card.Title
            title={NO_ROTOR_SELECTED}
            style={rotorStyles.cardComponent}
            right={() => (
              <Button
                mode='contained'
                testID={SET_ROTOR_BUTTON}
                onPress={setRotor}
              >
                {SELECT_ROTOR}
              </Button>
            )}
          />
        )}
      </Card>
    </View>
  );
};
