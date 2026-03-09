import { StyleSheet } from 'react-native';

import type { ColorPalette } from '../../../theme/colors';

export const makeStyles = (colors: ColorPalette) =>
  StyleSheet.create({
    modalText: {
      color: colors.textPrimary,
      marginBottom: 8,
    },
    selectRotor: {
      backgroundColor: colors.surface,
      padding: 20,
      marginHorizontal: 50,
      marginVertical: 30,
    },
  });
