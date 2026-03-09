import { StyleSheet } from 'react-native';

import type { ColorPalette } from '../../../theme/colors';

export const makeStyles = (colors: ColorPalette) =>
  StyleSheet.create({
    rotor: {
      marginVertical: 10,
      paddingHorizontal: 0,
      backgroundColor: colors.surface,
    },
    cardComponent: {
      paddingHorizontal: 10,
    },
  });
