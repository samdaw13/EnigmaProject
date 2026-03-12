import type { FunctionComponent, ReactNode } from 'react';
import React, { useMemo } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useThemeColors } from '../../../theme/useThemeColors';

const PAGE_HORIZONTAL_PADDING = 16;

const styles = StyleSheet.create({
  scrollFlex: { flex: 1 },
  contentPadding: { padding: PAGE_HORIZONTAL_PADDING },
});

interface PageProps {
  children: ReactNode;
  scrollable?: boolean;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
}

export const Page: FunctionComponent<PageProps> = ({
  children,
  scrollable = true,
  style,
  contentContainerStyle,
}) => {
  const colors = useThemeColors();

  const screenStyle = useMemo(
    () => ({
      flex: 1 as const,
      backgroundColor: colors.background,
    }),
    [colors.background],
  );

  if (scrollable) {
    return (
      <SafeAreaView style={screenStyle} edges={['bottom']}>
        <ScrollView
          style={[styles.scrollFlex, style]}
          contentContainerStyle={[styles.contentPadding, contentContainerStyle]}
        >
          {children}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[screenStyle, styles.contentPadding, style]}
      edges={['bottom']}
    >
      {children}
    </SafeAreaView>
  );
};
