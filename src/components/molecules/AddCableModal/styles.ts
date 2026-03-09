import { StyleSheet } from 'react-native';

import type { ColorPalette } from '../../../theme/colors';

export const makeStyles = (colors: ColorPalette) =>
  StyleSheet.create({
    selectRotor: {
      backgroundColor: colors.surface,
      padding: 20,
      marginHorizontal: 50,
      marginVertical: 30,
    },
  });
