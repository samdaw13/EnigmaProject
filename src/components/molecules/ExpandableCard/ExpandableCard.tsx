import type { FunctionComponent, ReactNode } from 'react';
import React, { useMemo } from 'react';
import { Pressable, View } from 'react-native';

import { useThemeColors } from '../../../theme/useThemeColors';
import { makeStyles } from './styles';

export const ExpandableCard: FunctionComponent<{
  testID: string;
  header: ReactNode;
  children: ReactNode;
  expanded: boolean;
  onPress: () => void;
}> = ({ testID, header, children, expanded, onPress }) => {
  const colors = useThemeColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  return (
    <Pressable
      testID={testID}
      style={styles.card}
      onPress={onPress}
      role='button'
    >
      {header}
      {expanded && <View>{children}</View>}
    </Pressable>
  );
};
