import { FunctionComponent } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../../../theme/colors';

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
  },
  text: {
    color: colors.textPrimary,
  },
});

export const About: FunctionComponent = () => {
  return (
    <View style={styles.screen}>
      <Text style={styles.text}>About enigma</Text>
    </View>
  );
};
