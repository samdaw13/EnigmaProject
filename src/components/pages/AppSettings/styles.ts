import { StyleSheet } from 'react-native';

import type { ColorPalette } from '../../../theme/colors';

export const makeStyles = (colors: ColorPalette, bottomInset: number = 0) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContent: {
      padding: 20,
      paddingBottom: 40 + bottomInset,
    },
    label: {
      color: colors.textPrimary,
      fontSize: 15,
      marginBottom: 12,
    },
    description: {
      color: colors.textSecondary,
      fontSize: 13,
      marginBottom: 12,
    },
    resetButton: {
      borderColor: colors.destructive,
    },
  });
