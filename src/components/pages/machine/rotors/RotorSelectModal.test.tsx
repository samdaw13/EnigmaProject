import React from 'react';
import { render, screen, fireEvent } from '../../../../utils/test-utils';
import { RotorSelectModal } from './RotorSelectModal';
import { RotorState } from '../../../../types';

describe(`RotorSelectModal`, () => {
  const mockRotorState: RotorState = {
    isAvailable: true,
    config: {
      stepIndex: 1,
      displayedLetters: ['A', 'B', 'C'],
      mappedLetters: ['D', 'E', 'F'],
      currentIndex: 0,
    },
    id: 1,
  };
  const renderComponent = (
    modalVisible: boolean,
    setModalVisible: React.Dispatch<React.SetStateAction<boolean>>,
    currentRotor: RotorState | null,
    setRotor: React.Dispatch<React.SetStateAction<RotorState | null>>,
  ) => {
    render(
      <RotorSelectModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        currentRotor={currentRotor}
        setRotor={setRotor}
      />,
    );
  };
  it(`selects a rotor and closes the modal`, () => {
    const setModalMock = jest.fn();
    const setRotorMock = jest.fn();
    renderComponent(true, setModalMock, mockRotorState, setRotorMock);
    fireEvent.press(screen.getByTestId('selectRotorBtn1'));
    expect(setRotorMock).toHaveBeenCalledWith(mockRotorState);
    expect(setModalMock).toHaveBeenCalledWith(false);
  });
});
