import React from 'react';
import { render, screen, fireEvent } from '../../../../utils/test-utils';
import { ChangeIndexModal } from './ChangeIndexModal';
import { RotorState } from '../../../../types';

describe(`ChangeIndexModal`, () => {
  const mockRotorState: RotorState = {
    isAvailable: false,
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
      <ChangeIndexModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        currentRotor={currentRotor}
        setRotor={setRotor}
      />,
    );
  };
  it(`selects a letter and closes the modal`, () => {
    const setModalMock = jest.fn();
    const setRotorMock = jest.fn();
    renderComponent(true, setModalMock, mockRotorState, setRotorMock);
    fireEvent.press(screen.getByTestId('buttonB1'));
    expect(setRotorMock).toHaveBeenCalledWith(mockRotorState);
    expect(setModalMock).toHaveBeenCalledWith(false);
  });
});
