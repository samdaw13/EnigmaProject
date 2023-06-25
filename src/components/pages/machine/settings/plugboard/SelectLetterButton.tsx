import React, { FunctionComponent } from 'react';
import { ScrollView, View } from 'react-native';
import { Button, Text } from 'react-native-paper';

import { SelectLetterProps } from '../../../../../types';

export const SelectLetterButton: FunctionComponent<SelectLetterProps> = ({
  setLetter,
  displayText,
  availableLetters,
  setAvailableLetters,
  testID,
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
