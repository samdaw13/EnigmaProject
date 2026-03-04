import React from 'react';

import { RotorState } from '../../../../../types';
import { letterButton } from '../../../../../utils';
import {
  fireEvent,
  render,
  ROTOR_1,
  screen,
} from '../../../../../utils/test-utils';
import { ChangeIndexModal } from './ChangeIndexModal';

describe(`ChangeIndexModal`, () => {
  const renderComponent = async (
    modalVisible: boolean,
    setModalVisible: React.Dispatch<React.SetStateAction<boolean>>,
    currentRotor: RotorState | null,
    setRotor: React.Dispatch<React.SetStateAction<RotorState | null>>,
  ) => {
    await render(
      <ChangeIndexModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        currentRotor={currentRotor}
        setRotor={setRotor}
      />,
    );
  };
  it(`selects a letter and closes the modal`, async () => {
    const setModalMock = jest.fn();
    const setRotorMock = jest.fn();
    await renderComponent(true, setModalMock, ROTOR_1, setRotorMock);
    // ESLint keeps saying fireEvent needs an await and is sync
    // eslint-disable-next-line testing-library/no-await-sync-events
    await fireEvent.press(screen.getByTestId(letterButton('B', 1)));
    expect(setRotorMock).toHaveBeenCalledWith(ROTOR_1);
    expect(setModalMock).toHaveBeenCalledWith(false);
  });
});
