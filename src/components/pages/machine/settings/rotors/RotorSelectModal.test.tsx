import React from 'react';

import { RotorState } from '../../../../../types';
import { selectRotorButton } from '../../../../../utils';
import {
  fireEvent,
  render,
  ROTOR_1,
  screen,
} from '../../../../../utils/test-utils';
import { RotorSelectModal } from './RotorSelectModal';

describe(`RotorSelectModal`, () => {
  const renderComponent = async (
    modalVisible: boolean,
    setModalVisible: React.Dispatch<React.SetStateAction<boolean>>,
    currentRotor: RotorState | null,
    setRotor: React.Dispatch<React.SetStateAction<RotorState | null>>,
  ) => {
    await render(
      <RotorSelectModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        currentRotor={currentRotor}
        setRotor={setRotor}
      />,
    );
  };
  it(`selects a rotor and closes the modal`, async () => {
    const setModalMock = jest.fn();
    const setRotorMock = jest.fn();
    await renderComponent(true, setModalMock, ROTOR_1, setRotorMock);

    // For some reason ESLint claims this line both needs an await and does not
    // eslint-disable-next-line testing-library/no-await-sync-events
    await fireEvent.press(screen.getByTestId(selectRotorButton(1)));
    expect(setRotorMock).toHaveBeenCalledWith(ROTOR_1);
    expect(setModalMock).toHaveBeenCalledWith(false);
  });
});
