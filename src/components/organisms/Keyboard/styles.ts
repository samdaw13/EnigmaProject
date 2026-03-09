import { Dimensions, StyleSheet } from 'react-native';

import type { ColorPalette } from '../../../theme/colors';

const KEYS_IN_TOP_ROW = 10;
const KEY_MARGIN = 2;
const ROW_PADDING = 4;
const KEY_SIZE =
  (Dimensions.get('window').width -
    ROW_PADDING * 2 -
    KEY_MARGIN * 2 * KEYS_IN_TOP_ROW) /
  KEYS_IN_TOP_ROW;

export const makeStyles = (colors: ColorPalette, bottomInset: number = 0) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.background,
    },
    container: {
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-end',
      paddingBottom: 24 + bottomInset,
    },
    horizontalRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 3,
      paddingHorizontal: ROW_PADDING,
    },
    key: {
      width: KEY_SIZE,
      minWidth: 0,
      borderRadius: 100,
      marginHorizontal: KEY_MARGIN,
      marginVertical: 3,
      justifyContent: 'center',
      paddingHorizontal: 0,
      borderColor: colors.border,
      borderWidth: 1.5,
    },
    outputContainer: {
      alignItems: 'center',
      paddingVertical: 30,
      flex: 1,
      justifyContent: 'center',
    },
    outputLetter: {
      fontSize: 48,
      fontWeight: 'bold',
      color: colors.accent,
    },
    messageText: {
      fontSize: 16,
      color: colors.textSecondary,
      letterSpacing: 2,
      paddingHorizontal: 10,
      marginTop: 12,
    },
    rotorDisplayRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 8,
      paddingVertical: 8,
    },
    rotorWindow: {
      width: 36,
      height: 36,
      borderRadius: 6,
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderWidth: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    rotorWindowText: {
      color: colors.textPrimary,
      fontWeight: 'bold',
      fontSize: 18,
    },
    plugboardRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      paddingHorizontal: 12,
      paddingBottom: 8,
    },
    plugboardChip: {
      margin: 3,
      borderColor: colors.border,
      borderWidth: 1,
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    headerActions: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    pasteModal: {
      backgroundColor: colors.surface,
      margin: 24,
      padding: 20,
      borderRadius: 8,
    },
    pasteInput: {
      backgroundColor: colors.surface,
      marginBottom: 12,
    },
    pasteButtonRow: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      gap: 8,
    },
  });
