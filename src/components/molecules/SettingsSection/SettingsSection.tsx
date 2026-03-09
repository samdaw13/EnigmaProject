import type { FunctionComponent } from 'react';
import React, { useMemo } from 'react';
import { Text, View } from 'react-native';

import { useThemeColors } from '../../../theme/useThemeColors';
import { makeStyles } from './styles';

export const SettingsSection: FunctionComponent<{
  heading: string;
  children: React.ReactNode;
}> = ({ heading, children }) => {
  const colors = useThemeColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  return (
    <View style={styles.section}>
      <Text style={styles.sectionHeading}>{heading}</Text>
      <View style={styles.sectionDivider} />
      {children}
    </View>
  );
};
