import { useNavigation } from '@react-navigation/native';
import type { FunctionComponent } from 'react';
import React, { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, IconButton } from 'react-native-paper';

import {
  ENCRYPT_MESSAGE,
  ENCRYPT_MESSAGE_BUTTON,
  INFO_BUTTON,
  INFO_SETTINGS_CONTENT,
  INFO_SETTINGS_TITLE,
} from '../../../../constants';
import type { ColorPalette } from '../../../../theme/colors';
import { useThemeColors } from '../../../../theme/useThemeColors';
import type { NextScreenNavigationProp } from '../../../../types';
import { InfoSidebar } from '../../../InfoSidebar';
import { Plugboard } from './plugboard';
import { Rotors } from './rotors';

const makeStyles = (colors: ColorPalette) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.background,
    },
    infoRow: {
      alignItems: 'flex-end',
    },
  });

export const Settings: FunctionComponent = () => {
  const navigation = useNavigation<NextScreenNavigationProp>();
  const colors = useThemeColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const [infoVisible, setInfoVisible] = useState(false);

  const navigateToNextItem = () => {
    navigation.navigate('Keyboard');
  };
  return (
    <View style={styles.screen}>
      <View style={styles.infoRow}>
        <IconButton
          testID={INFO_BUTTON}
          icon='information'
          iconColor={colors.textSecondary}
          size={22}
          onPress={() => setInfoVisible(true)}
        />
      </View>
      <Rotors />
      <Plugboard />
      <Button
        onPress={navigateToNextItem}
        testID={ENCRYPT_MESSAGE_BUTTON}
        textColor={colors.accent}
      >
        {ENCRYPT_MESSAGE}
      </Button>
      <InfoSidebar
        visible={infoVisible}
        onDismiss={() => setInfoVisible(false)}
        title={INFO_SETTINGS_TITLE}
        content={INFO_SETTINGS_CONTENT}
      />
    </View>
  );
};
