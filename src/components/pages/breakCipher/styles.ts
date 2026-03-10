import { StyleSheet } from 'react-native';

import type { ColorPalette } from '../../../theme/colors';

export const makeStyles = (colors: ColorPalette) =>
  StyleSheet.create({
    scrollPadding: {
      paddingVertical: 16,
    },
    contentContainer: {},
    input: {
      marginBottom: 12,
      backgroundColor: colors.surface,
    },
    cancelButton: {
      marginTop: 4,
      borderColor: colors.border,
    },
    saveButton: {
      marginVertical: 12,
    },
    hintText: {
      color: colors.textSecondary,
      fontSize: 12,
      marginBottom: 8,
    },
  });
