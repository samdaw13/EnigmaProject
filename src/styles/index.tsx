import { Dimensions, StyleSheet } from 'react-native';

const KEYS_IN_TOP_ROW = 10;
const KEY_MARGIN = 2;
const ROW_PADDING = 4;
const KEY_SIZE =
  (Dimensions.get('window').width -
    ROW_PADDING * 2 -
    KEY_MARGIN * 2 * KEYS_IN_TOP_ROW) /
  KEYS_IN_TOP_ROW;

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
  screen: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 24,
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
    borderColor: '#5a534d',
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
    color: '#FFD700',
  },
  messageText: {
    fontSize: 16,
    color: '#E0E0E0',
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
    backgroundColor: '#2a2a2a',
    borderColor: '#5a534d',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rotorWindowText: {
    color: '#F5F0E8',
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
    borderColor: '#5a534d',
    borderWidth: 1,
  },
});
