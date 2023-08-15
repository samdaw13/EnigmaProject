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
    <View style={{flex: 1}}>
      <Text>{KEYBOARD}</Text>
      <BackButton />
      

      
      
        <View style={keyboardStyles.container}>
          {keyboardLayout.map((row, rowIndex) => (
            <View key={rowIndex} style={keyboardStyles.horizontalRow}>
              {row.map((key, keyIndex) => (
                <Button
                  key={keyIndex}
                  mode='outlined'
                  compact={true}
                  style={keyboardStyles.key}
                  theme={{ roundness: 2 }}
                  textColor='white'
                  buttonColor='#8C857F'
                >
                  {key}
                </Button>
              ))}
            </View>
          ))}
        </View>
      
    </View>
  );
};
