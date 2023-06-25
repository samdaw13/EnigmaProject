import React from 'react';

import { RotorState } from '../../../../../types';
import { ROTOR_1, fireEvent, render, screen, selectRotorButton } from '../../../../../utils';
import { RotorSelectModal } from './RotorSelectModal';

describe(`RotorSelectModal`, () => {
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
    renderComponent(true, setModalMock, ROTOR_1, setRotorMock);
    fireEvent.press(screen.getByTestId(selectRotorButton(1)));
    expect(setRotorMock).toHaveBeenCalledWith(ROTOR_1);
    expect(setModalMock).toHaveBeenCalledWith(false);
  });
});
