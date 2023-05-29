import { StyleSheet } from 'react-native';

export const buttonStyles = StyleSheet.create({
  container: {
    margin: 10,
    height: 250,
  },
  mainMenuButton: {
    marginHorizontal: 60,
  },
});

export const rotorStyles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    margin: 10,
    paddingHorizontal: 0,
  },
  rotor: {
    marginVertical: 10,
    paddingHorizontal: 0,
  },
  selectRotor: {
    backgroundColor: 'white',
    padding: 20,
  },
});
