import type { FunctionComponent } from 'react';
import React, { useMemo, useState } from 'react';
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
import {
  clearSelectedRotor,
  setSelectedRotor as setSelectedRotorAction,
  updateRotorAvailability,
} from '../../../../../features/rotors/features';
import type { RootState } from '../../../../../store/store';
import { makeRotorStyles } from '../../../../../styles';
import { useThemeColors } from '../../../../../theme/useThemeColors';
import type { RotorState } from '../../../../../types';
import { currentLetter, currentRotor } from '../../../../../utils';
import { ChangeIndexModal } from './ChangeIndexModal';
import { RotorSelectModal } from './RotorSelectModal';

interface RotorProps {
  slotIndex: number;
}

export const Rotor: FunctionComponent<RotorProps> = ({ slotIndex }) => {
  const rotors = useSelector((state: RootState) => state.rotors.available);
  const selectedRotorId = useSelector(
    (state: RootState) => state.rotors.selectedSlots[slotIndex],
  );
  const selectedRotor =
    selectedRotorId != null ? (rotors[selectedRotorId] ?? null) : null;
  const [isSelectModalOpen, setIsSelectModalOpen] = useState(false);
  const [isChangeIndexModalOpen, setIsChangeIndexModalOpen] = useState(false);
  const dispatch = useDispatch();
  const colors = useThemeColors();
  const rotorStyles = useMemo(() => makeRotorStyles(colors), [colors]);

  const openSelectModal = () => {
    setIsSelectModalOpen(true);
  };
  const removeRotor = () => {
    if (selectedRotor)
      dispatch(
        updateRotorAvailability({ id: selectedRotor.id, isAvailable: true }),
      );
    dispatch(clearSelectedRotor({ slotIndex }));
  };
  const handleSetRotor = (rotor: RotorState | null) => {
    if (rotor !== null) {
      dispatch(setSelectedRotorAction({ slotIndex, rotorId: rotor.id }));
    }
  };
  return (
    <View>
      <Portal>
        <RotorSelectModal
          modalVisible={isSelectModalOpen}
          setModalVisible={setIsSelectModalOpen}
          setRotor={handleSetRotor}
          currentRotor={selectedRotor}
        />
        {selectedRotor && (
          <ChangeIndexModal
            modalVisible={isChangeIndexModalOpen}
            setModalVisible={setIsChangeIndexModalOpen}
            setRotor={handleSetRotor}
            currentRotor={selectedRotor}
          />
        )}
      </Portal>
      <Card style={rotorStyles.rotor} contentStyle={{ paddingHorizontal: 0 }}>
        {selectedRotor && (
          <View>
            <Card.Title
              title={currentLetter(
                selectedRotor.config.displayedLetters[
                  selectedRotor.config.currentIndex
                ]!,
              )}
              subtitle={currentRotor(selectedRotor.id)}
              style={rotorStyles.cardComponent}
              titleStyle={{ color: colors.textPrimary }}
              subtitleStyle={{ color: colors.textSecondary }}
              right={() => (
                <IconButton
                  testID={REMOVE_ROTOR_BUTTON}
                  icon='close-circle'
                  mode='contained-tonal'
                  containerColor={colors.surface}
                  iconColor={colors.destructive}
                  onPress={removeRotor}
                />
              )}
            />
            <Card.Actions style={rotorStyles.cardComponent}>
              <Button
                testID={REPLACE_ROTOR_BUTTON}
                mode='outlined'
                textColor={colors.textPrimary}
                style={{ borderColor: colors.border }}
                onPress={openSelectModal}
              >
                {REPLACE_ROTOR}
              </Button>
              <Button
                testID={CHANGE_LETTER_BUTTON}
                mode='outlined'
                textColor={colors.textPrimary}
                style={{ borderColor: colors.border }}
                onPress={() => setIsChangeIndexModalOpen(true)}
              >
                {CHANGE_CURRENT_LETTER}
              </Button>
            </Card.Actions>
          </View>
        )}
        {selectedRotor === null && (
          <Card.Title
            title={NO_ROTOR_SELECTED}
            titleStyle={{ color: colors.textPrimary }}
            style={rotorStyles.cardComponent}
            right={() => (
              <Button
                mode='contained'
                testID={SET_ROTOR_BUTTON}
                buttonColor={colors.accent}
                textColor={colors.background}
                onPress={openSelectModal}
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
