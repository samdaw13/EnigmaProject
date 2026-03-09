import { StyleSheet } from 'react-native';

import type { ColorPalette } from '../../../theme/colors';

export const makeStyles = (colors: ColorPalette) =>
  StyleSheet.create({
    modalText: {
      color: colors.textPrimary,
      marginBottom: 8,
    },
  });
