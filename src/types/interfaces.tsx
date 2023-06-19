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
  [id: number]: RotorState;
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
}
