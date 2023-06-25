import React from 'react';

import { RotorState } from '../../../../../types';
import { ROTOR_1, fireEvent, letterButton, render, screen } from '../../../../../utils';
import { ChangeIndexModal } from './ChangeIndexModal';


describe(`ChangeIndexModal`, () => {
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
    renderComponent(true, setModalMock, ROTOR_1, setRotorMock);
    fireEvent.press(screen.getByTestId(letterButton('B', 1)));
    expect(setRotorMock).toHaveBeenCalledWith(ROTOR_1);
    expect(setModalMock).toHaveBeenCalledWith(false);
  });
});
