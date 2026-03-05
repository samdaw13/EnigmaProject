import { useNavigation } from '@react-navigation/native';
import type { FunctionComponent } from 'react';
import React from 'react';
import { IconButton } from 'react-native-paper';

import { KEYBOARD_GO_BACK_BUTTON } from '../../../../constants';
import { useThemeColors } from '../../../../theme/useThemeColors';
import type { NextScreenNavigationProp } from '../../../../types';

export const BackButton: FunctionComponent = () => {
  const navigation = useNavigation<NextScreenNavigationProp>();
  const colors = useThemeColors();

  const navigateToPreviousScreen = () => {
    navigation.goBack();
  };
  return (
    <IconButton
      icon='arrow-left'
      iconColor={colors.textPrimary}
      size={24}
      onPress={navigateToPreviousScreen}
      testID={KEYBOARD_GO_BACK_BUTTON}
    />
  );
};
