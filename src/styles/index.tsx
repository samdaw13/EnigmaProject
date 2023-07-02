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
    marginHorizontal: 50,
    marginVertical: 30,
  },
  cardComponent: {
    paddingHorizontal: 10,
  },
  chip: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});

export const keyboardStyles = StyleSheet.create({
  horizontalRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'flex-end',
  },
  verticalRow: {
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    position: 'absolute',
    bottom: 0,
  },
  key: {
    justifyContent: 'center',
    minWidth: '10%',
  },
});
