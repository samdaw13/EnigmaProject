import type { FunctionComponent } from 'react';
import React, { useMemo } from 'react';
import { ScrollView, View } from 'react-native';
import { Button, Text } from 'react-native-paper';

import { useThemeColors } from '../../../theme/useThemeColors';
import type { SelectLetterProps } from '../../../types';
import { makeStyles } from './styles';

export const SelectLetterButton: FunctionComponent<SelectLetterProps> = ({
  setLetter,
  displayText,
  availableLetters,
  setAvailableLetters,
  testID,
}) => {
  const colors = useThemeColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const updateLetter = (letter: string) => {
    setLetter(letter);
    setAvailableLetters(
      availableLetters.filter((availableLetter) => availableLetter !== letter),
    );
  };
  return (
    <View>
      <Text style={styles.modalText}>{displayText}</Text>
      <ScrollView>
        {availableLetters.map((letter, index) => {
          return (
            <Button
              key={letter}
              mode='text'
              textColor={colors.textPrimary}
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
