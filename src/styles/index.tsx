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
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-end',
    // backgroundColor: '#080403', TODO: pick a color
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
    height: 200,
  },
  horizontalRow: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    
    
  },
  key: {
    flexBasis: 37,
    margin: '0.5%',
    justifyContent: 'center',
    borderColor: '#525252',
    borderWidth: 2,
  },
});
