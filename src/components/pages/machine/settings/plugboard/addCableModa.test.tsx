import React from 'react';

import {
  SELECT_INPUT_LETTER,
  SELECT_OUTPUT_LETTER,
} from '../../../../../constants';
import { fireEvent, render, screen } from '../../../../../utils';
import { AddCableModal } from './addCableModal';

describe(`addCableModal`, () => {
  const renderComponent = (
    modalVisible: boolean,
    setModalVisible: React.Dispatch<React.SetStateAction<boolean>>,
  ) => {
    render(
      <AddCableModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      />,
    );
  };
  it(`selects input and output letter`, () => {
    const mockModalVisible = jest.fn();
    renderComponent(true, mockModalVisible);
    fireEvent.press(screen.getByTestId(`${SELECT_INPUT_LETTER}1`));
    fireEvent.press(screen.getByTestId(`${SELECT_OUTPUT_LETTER}1`));
    expect(mockModalVisible).toHaveBeenCalledWith(false);
  });
  it(`removes letter selected from input when selecting output`, () => {
    const mockModalVisible = jest.fn();
    renderComponent(true, mockModalVisible);
    fireEvent.press(screen.getByTestId(`${SELECT_INPUT_LETTER}25`));
    expect(screen.queryByTestId(`${SELECT_OUTPUT_LETTER}25`)).toBeFalsy();
  });
});
