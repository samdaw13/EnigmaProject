import React from 'react';

import { NLP_SCORE_DISPLAY } from '../../../constants/selectors';
import { nlpColors } from '../../../theme/colors';
import { render, screen } from '../../../utils/test-utils';
import { NlpBadge } from './NlpBadge';

describe('NlpBadge', () => {
  it.each([
    { score: 85, expectedColor: nlpColors.high },
    { score: 55, expectedColor: nlpColors.medium },
    { score: 20, expectedColor: nlpColors.low },
  ])(
    'renders with $expectedColor background for score $score',
    async ({ score, expectedColor }) => {
      await render(<NlpBadge score={score} testIdSuffix='0' />);
      const textElement = screen.getByTestId(`${NLP_SCORE_DISPLAY}_0`);
      const badgeView = textElement.parent;
      expect(badgeView).toHaveStyle({ backgroundColor: expectedColor });
    },
  );
});
