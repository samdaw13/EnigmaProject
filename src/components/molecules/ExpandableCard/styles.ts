import { StyleSheet } from 'react-native';

import type { ColorPalette } from '../../../theme/colors';

export const makeStyles = (colors: ColorPalette) =>
  StyleSheet.create({
    card: {
      backgroundColor: colors.surface,
      borderRadius: 8,
      padding: 12,
      marginBottom: 8,
      borderColor: colors.border,
      borderWidth: 1,
    },
  });
