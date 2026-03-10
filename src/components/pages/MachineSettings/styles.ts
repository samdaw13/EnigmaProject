import { StyleSheet } from 'react-native';

export const makeStyles = () =>
  StyleSheet.create({
    content: {
      flex: 1,
    },
    bottomSection: {
      paddingBottom: 16,
      gap: 8,
    },
    buttonRow: {
      flexDirection: 'row',
      gap: 8,
    },
    rowButton: {
      flex: 1,
    },
  });
