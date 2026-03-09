import { StyleSheet } from 'react-native';

import type { ColorPalette } from '../../../theme/colors';

export const makeStyles = (colors: ColorPalette, bottomInset: number = 0) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.background,
      padding: 16,
    },
    contentContainer: {
      paddingBottom: 16 + bottomInset,
    },
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
