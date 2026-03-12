import { StyleSheet } from 'react-native';

import type { ColorPalette } from '../../../theme/colors';

export const makeStyles = (colors: ColorPalette) =>
  StyleSheet.create({
    scrollContent: {},
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
