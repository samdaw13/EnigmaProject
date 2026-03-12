import { StyleSheet } from 'react-native';

import type { ColorPalette } from '../../../theme/colors';

export const makeStyles = (colors: ColorPalette) =>
  StyleSheet.create({
    contentContainer: {
      height: '100%',
    },
    input: {
      marginBottom: 12,
    },
    cancelButton: {
      marginTop: 4,
      borderColor: colors.border,
    },
    saveButton: {
      marginVertical: 12,
    },
    positionButton: {
      marginBottom: 12,
      borderColor: colors.border,
    },
    hintText: {
      color: colors.textSecondary,
      fontSize: 12,
      marginBottom: 8,
    },
  });
