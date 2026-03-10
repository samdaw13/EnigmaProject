import type { FunctionComponent, ReactNode } from 'react';
import React, { useMemo } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useThemeColors } from '../../../theme/useThemeColors';

const PAGE_HORIZONTAL_PADDING = 16;

const styles = StyleSheet.create({
  scrollFlex: { flex: 1 },
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
      paddingHorizontal: PAGE_HORIZONTAL_PADDING,
    }),
    [colors.background],
  );

  if (scrollable) {
    return (
      <SafeAreaView style={screenStyle} edges={['bottom']}>
        <ScrollView
          style={[styles.scrollFlex, style]}
          contentContainerStyle={contentContainerStyle}
        >
          {children}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[screenStyle, style]} edges={['bottom']}>
      {children}
    </SafeAreaView>
  );
};
