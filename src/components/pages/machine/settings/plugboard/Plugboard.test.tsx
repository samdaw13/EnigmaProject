import React from 'react';

import {
  ADD_CABLE_MODAL_BUTTON,
  SELECT_INPUT_LETTER,
  SELECT_OUTPUT_LETTER,
} from '../../../../../constants';
import {
  fireEvent,
  render,
  screen,
  within,
} from '../../../../../utils/test-utils';
import { Plugboard } from './Plugboard';

describe(`Plugboard`, () => {
  const renderComponent = async () => {
    await render(<Plugboard />);
  };
  it(`opens modal and adds chip, and removes chip`, async () => {
    await renderComponent();
    expect(screen.queryAllByTestId(`BC`)).toHaveLength(0);
    await fireEvent.press(screen.getByTestId(ADD_CABLE_MODAL_BUTTON));
    await fireEvent.press(screen.getByTestId(`${SELECT_INPUT_LETTER}1`));
    await fireEvent.press(screen.getByTestId(`${SELECT_OUTPUT_LETTER}1`));
    expect(screen.queryAllByTestId(`BC`)).toHaveLength(1);
    await fireEvent.press(screen.getByTestId(ADD_CABLE_MODAL_BUTTON));
    expect(
      within(screen.getByTestId(`${SELECT_INPUT_LETTER}1`)).queryAllByText('D'),
    ).toHaveLength(1);
    await fireEvent.press(screen.getByLabelText('Close'));
    expect(screen.queryAllByTestId(`BC`)).toHaveLength(0);
    await fireEvent.press(screen.getByTestId(ADD_CABLE_MODAL_BUTTON));
    expect(
      within(screen.getByTestId(`${SELECT_INPUT_LETTER}1`)).queryAllByText('B'),
    ).toHaveLength(1);
  }, 15000);
});
