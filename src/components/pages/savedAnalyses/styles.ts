import { StyleSheet } from 'react-native';

import type { ColorPalette } from '../../../theme/colors';

export const makeStyles = (colors: ColorPalette, bottomInset: number = 0) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContent: {
      padding: 16,
      paddingBottom: 16 + bottomInset,
    },
    title: {
      color: colors.accent,
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 16,
    },
    ciphertextPreview: {
      color: colors.textSecondary,
      fontSize: 13,
      letterSpacing: 1,
      marginBottom: 4,
    },
    secondaryText: {
      color: colors.textSecondary,
      fontSize: 12,
      marginBottom: 4,
    },
    text: {
      color: colors.textPrimary,
      fontSize: 14,
      marginBottom: 4,
    },
    resultsTitle: {
      color: colors.accent,
      fontSize: 16,
      fontWeight: 'bold',
      marginTop: 8,
      marginBottom: 8,
    },
    resultCard: {
      backgroundColor: colors.background,
      borderRadius: 6,
      padding: 10,
      marginBottom: 6,
    },
    deleteButton: {
      alignSelf: 'flex-start',
      marginTop: 8,
    },
    emptyText: {
      color: colors.textSecondary,
      textAlign: 'center',
      marginTop: 40,
      fontSize: 14,
    },
  });
