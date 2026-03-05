import { NavigationProp } from '@react-navigation/native';

export interface RotorSelectModalProps {
  modalVisible: boolean;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  currentRotor: RotorState | null;
  setRotor: React.Dispatch<React.SetStateAction<RotorState | null>>;
}

export interface ChangeIndexModalProps {
  rotor: RotorState;
  modalVisible: boolean;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface RotorConfig {
  stepIndex: number;
  displayedLetters: Array<string>;
  mappedLetters: Array<string>;
  currentIndex: number;
}

export interface RotorState {
  isAvailable: boolean;
  config: RotorConfig;
  id: number;
}

export interface RotorsState {
  available: { [id: number]: RotorState };
  selectedSlots: (number | null)[];
}

export interface RotorContextInterface {
  availableRotors: Array<RotorState>;
  updateRotors: (id: number, isAvailable: boolean) => void;
}

export interface UpdateRotorAvailabilityInterface {
  id: number;
  isAvailable: boolean;
}

export interface UpdateRotorCurrentIndexInterface {
  id: number;
  currentIndex: number;
}

export interface PlugboardCable {
  [plugLetter: string]: string;
}

export interface PlugboardActionInterface {
  inputLetter: string;
  outputLetter: string;
}

export interface AddCableModalProps {
  modalVisible: boolean;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface SelectLetterProps {
  setLetter: React.Dispatch<React.SetStateAction<string | null>>;
  availableLetters: string[];
  setAvailableLetters: React.Dispatch<React.SetStateAction<string[]>>;
  displayText: string;
  testID?: string;
}

export type MachineStackParamList = {
  Keyboard: undefined;
};

export type NextScreenNavigationProp = NavigationProp<
  MachineStackParamList,
  'Keyboard'
>;

export interface ReflectorConfig {
  mapping: string[];
}

export interface ReflectorState {
  id: number;
  name: string;
  config: ReflectorConfig;
}

export interface ReflectorsState {
  reflectors: { [id: number]: ReflectorState };
  selectedReflectorId: number;
}

export interface UpdateSelectedReflectorInterface {
  id: number;
}

export interface SelectedRotorAction {
  slotIndex: number;
  rotorId: number;
}

export type Theme = 'dark' | 'light';

export interface SettingsState {
  theme: Theme;
}
