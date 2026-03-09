import type { FunctionComponent } from 'react';
import React from 'react';

import { NLP_CONFIDENCE_LABEL } from '../../../constants/labels';
import { NLP_SCORE_DISPLAY } from '../../../constants/selectors';
import { nlpColors } from '../../../theme/colors';
import { Badge } from '../../atoms/Badge';

const nlpBadgeColor = (score: number): string => {
  if (score >= 70) return nlpColors.high;
  if (score >= 40) return nlpColors.medium;
  return nlpColors.low;
};

export const NlpBadge: FunctionComponent<{
  score: number;
  testIdSuffix?: string;
}> = ({ score, testIdSuffix }) => (
  <Badge
    backgroundColor={nlpBadgeColor(score)}
    testID={
      testIdSuffix !== undefined
        ? `${NLP_SCORE_DISPLAY}_${testIdSuffix}`
        : undefined
    }
  >
    {NLP_CONFIDENCE_LABEL}: {score}%
  </Badge>
);
