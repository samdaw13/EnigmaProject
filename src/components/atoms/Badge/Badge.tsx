import type { FunctionComponent, ReactNode } from 'react';
import React, { useMemo } from 'react';
import { Text, View } from 'react-native';

import { useThemeColors } from '../../../theme/useThemeColors';
import { makeStyles } from './styles';

export const Badge: FunctionComponent<{
  backgroundColor: string;
  testID?: string | undefined;
  children: ReactNode;
}> = ({ backgroundColor, testID, children }) => {
  const colors = useThemeColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  return (
    <View style={[styles.badge, { backgroundColor }]}>
      <Text testID={testID} style={styles.badgeText}>
        {children}
      </Text>
    </View>
  );
};
