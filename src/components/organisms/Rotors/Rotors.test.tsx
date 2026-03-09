import React from 'react';

import { NO_ROTOR_SELECTED } from '../../../constants';
import { render, screen } from '../../../utils/test-utils';
import { Rotors } from './Rotors';

describe(`Rotors`, () => {
  const renderComponent = async () => {
    await render(<Rotors />);
  };
  it(`displays all rotors`, async () => {
    await renderComponent();
    expect(screen.getAllByText(NO_ROTOR_SELECTED)).toHaveLength(3);
  });
});
