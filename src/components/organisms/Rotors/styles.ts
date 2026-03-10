import { StyleSheet } from 'react-native';

import type { ColorPalette } from '../../../theme/colors';

export const makeStyles = (_colors: ColorPalette) =>
  StyleSheet.create({
    container: {
      flexDirection: 'column',
      justifyContent: 'space-evenly',
      marginVertical: 10,
    },
  });
