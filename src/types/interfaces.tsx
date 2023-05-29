import type {NativeStackScreenProps} from '@react-navigation/native-stack';

export interface MainProps extends NativeStackScreenProps<any, any> {}

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
  rotors: Array<RotorState>;
}

export interface RotorContextInterface {
  availableRotors: Array<RotorState>;
  updateRotors: (id: number, isAvailable: boolean) => void;
}

export interface UpdateRotorActionInterface {
  id: number;
  isAvailable?: boolean;
  currentIndex?: number;
}
