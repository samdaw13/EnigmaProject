import React, { FunctionComponent } from 'react';
import { Text, View } from 'react-native';
import { Button } from 'react-native-paper';

import { KEYBOARD } from '../../../../constants';
import { keyboardStyles } from '../../../../styles';
import { BackButton } from './BackButton';

export const Keyboard: FunctionComponent = () => {
  const keyboardLayout = [
    ['Q', 'W', 'E', 'R', 'T', 'Z', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Y', 'X', 'C', 'V', 'B', 'N', 'M'],
  ];
  return (
    <View>
      <Text>{KEYBOARD}</Text>
      <BackButton />
      <View style={{ position: 'relative', height: '92%' }}>
        <View style={keyboardStyles.verticalRow}>
          {keyboardLayout.map((row, rowIndex) => (
            <View key={rowIndex} style={keyboardStyles.horizontalRow}>
              {row.map((key, keyIndex) => (
                <Button
                  key={keyIndex}
                  mode='outlined'
                  compact={true}
                  style={keyboardStyles.key}
                  theme={{ roundness: 0 }}
                  textColor='white'
                  buttonColor='grey'
                >
                  {key}
                </Button>
              ))}
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};
