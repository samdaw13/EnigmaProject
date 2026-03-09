import React from 'react';

import { SELECT_INPUT_LETTER, SELECT_OUTPUT_LETTER } from '../../../constants';
import { fireEvent, render, screen } from '../../../utils/test-utils';
import { AddCableModal } from './AddCableModal';

describe(`addCableModal`, () => {
  const renderComponent = async (
    modalVisible: boolean,
    setModalVisible: React.Dispatch<React.SetStateAction<boolean>>,
  ) => {
    await render(
      <AddCableModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      />,
    );
  };
  it(`selects input and output letter`, async () => {
    const mockModalVisible = jest.fn();
    await renderComponent(true, mockModalVisible);
    await fireEvent.press(screen.getByTestId(`${SELECT_INPUT_LETTER}1`));
    await fireEvent.press(screen.getByTestId(`${SELECT_OUTPUT_LETTER}1`));
    expect(mockModalVisible).toHaveBeenCalledWith(false);
  });
  it(`removes letter selected from input when selecting output`, async () => {
    const mockModalVisible = jest.fn();
    await renderComponent(true, mockModalVisible);
    await fireEvent.press(screen.getByTestId(`${SELECT_INPUT_LETTER}25`));
    expect(screen.queryByTestId(`${SELECT_OUTPUT_LETTER}25`)).toBeFalsy();
  });
});
