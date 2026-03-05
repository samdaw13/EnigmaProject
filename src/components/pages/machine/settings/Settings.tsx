import { useNavigation } from '@react-navigation/native';
import type { FunctionComponent } from 'react';
import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';

import { ENCRYPT_MESSAGE, ENCRYPT_MESSAGE_BUTTON } from '../../../../constants';
import { ColorPalette } from '../../../../theme/colors';
import { useThemeColors } from '../../../../theme/useThemeColors';
import type { NextScreenNavigationProp } from '../../../../types';
import { Plugboard } from './plugboard';
import { Rotors } from './rotors';

const makeStyles = (colors: ColorPalette) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.background,
    },
  });

export const Settings: FunctionComponent = () => {
  const navigation = useNavigation<NextScreenNavigationProp>();
  const colors = useThemeColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);

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
