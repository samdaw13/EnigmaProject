import { StyleSheet } from 'react-native';

import type { ColorPalette } from '../../../theme/colors';

export const makeStyles = (colors: ColorPalette) =>
  StyleSheet.create({
    fallbackHeader: {
      color: colors.textSecondary,
      fontSize: 14,
      fontStyle: 'italic',
      marginTop: 16,
      marginBottom: 4,
    },
    resultsTitle: {
      color: colors.accent,
      fontSize: 18,
      fontWeight: 'bold',
      marginTop: 16,
      marginBottom: 8,
    },
    hintText: {
      color: colors.textSecondary,
      fontSize: 12,
      marginBottom: 8,
    },
    resultCard: {
      backgroundColor: colors.surface,
      borderRadius: 8,
      padding: 12,
      marginBottom: 8,
      borderColor: colors.border,
      borderWidth: 1,
    },
    resultText: {
      color: colors.textPrimary,
      fontSize: 14,
      marginBottom: 4,
    },
    alignmentText: {
      color: colors.textSecondary,
      fontFamily: 'monospace',
      fontSize: 12,
      marginTop: 4,
    },
  });
