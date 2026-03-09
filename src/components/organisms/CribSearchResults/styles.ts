import { StyleSheet } from 'react-native';

import type { ColorPalette } from '../../../theme/colors';

export const makeStyles = (colors: ColorPalette) =>
  StyleSheet.create({
    resultsTitle: {
      color: colors.accent,
      fontSize: 18,
      fontWeight: 'bold',
      marginTop: 16,
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
    paginationRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 8,
      marginBottom: 4,
      gap: 12,
    },
    pageIndicator: {
      color: colors.textSecondary,
      fontSize: 14,
    },
  });
