import { useNavigation } from '@react-navigation/native';
import type { FunctionComponent } from 'react';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';

import { ENCRYPT_MESSAGE, ENCRYPT_MESSAGE_BUTTON } from '../../../../constants';
import { colors } from '../../../../theme/colors';
import type { NextScreenNavigationProp } from '../../../../types';
import { Plugboard } from './plugboard';
import { Rotors } from './rotors';

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
});

export const Settings: FunctionComponent = () => {
  const navigation = useNavigation<NextScreenNavigationProp>();
  const navigateToNextItem = () => {
    navigation.navigate('Keyboard');
  };
  return (
    <View style={styles.screen}>
      <Rotors />
      <Plugboard />
      <Button
        onPress={navigateToNextItem}
        testID={ENCRYPT_MESSAGE_BUTTON}
        textColor={colors.accent}
      >
        {ENCRYPT_MESSAGE}
      </Button>
    </View>
  );
};
