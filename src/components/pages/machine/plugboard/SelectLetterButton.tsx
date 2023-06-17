import React, { FunctionComponent } from 'react';
import { SelectLetterProps } from '../../../../types';
import { View, ScrollView } from 'react-native';
import { Button, Text } from 'react-native-paper';

export const SelectLetterButton: FunctionComponent<SelectLetterProps> = ({
  setLetter,
  displayText,
  availableLetters,
  setAvailableLetters,
}) => {
  const updateLetter = (letter: string) => {
    setLetter(letter);
    setAvailableLetters(
      availableLetters.filter((availableLetter) => availableLetter !== letter),
    );
  };
  return (
    <View>
      <Text>{displayText}</Text>
      <ScrollView>
        {availableLetters.map((letter, index) => {
          return (
            <Button
              key={`${letter}${index}`}
              onPress={() => updateLetter(letter)}
            >
              {letter}
            </Button>
          );
        })}
      </ScrollView>
    </View>
  );
};
