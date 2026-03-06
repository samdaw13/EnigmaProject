import type { FunctionComponent } from 'react';
import React, { useMemo } from 'react';
import { ScrollView, View } from 'react-native';
import { Button, Text } from 'react-native-paper';

import { makeRotorStyles } from '../../../../../styles';
import { useThemeColors } from '../../../../../theme/useThemeColors';
import type { SelectLetterProps } from '../../../../../types';

export const SelectLetterButton: FunctionComponent<SelectLetterProps> = ({
  setLetter,
  displayText,
  availableLetters,
  setAvailableLetters,
  testID,
}) => {
  const colors = useThemeColors();
  const rotorStyles = useMemo(() => makeRotorStyles(colors), [colors]);

  const updateLetter = (letter: string) => {
    setLetter(letter);
    setAvailableLetters(
      availableLetters.filter((availableLetter) => availableLetter !== letter),
    );
  };
  return (
    <View>
      <Text style={rotorStyles.modalText}>{displayText}</Text>
      <ScrollView>
        {availableLetters.map((letter, index) => {
          return (
            <Button
              key={`${letter}${index}`}
              mode='outlined'
              textColor={colors.textPrimary}
              style={{ borderColor: colors.border }}
              onPress={() => updateLetter(letter)}
              testID={`${testID ?? 'test'}${index}`}
            >
              {letter}
            </Button>
          );
        })}
      </ScrollView>
    </View>
  );
};
