import type { FunctionComponent } from 'react';
import React, { useMemo, useState } from 'react';
import { Text, View } from 'react-native';
import { Button } from 'react-native-paper';

import type { CribSearchResult } from '../../../codebreaking';
import {
  DECRYPTED_TEXT_LABEL,
  DERIVED_PLUGBOARD_LABEL,
  NEXT_PAGE_LABEL,
  PAGE_LABEL,
  POSITION_LABEL,
  POSITIONS_LABEL,
  PREVIOUS_PAGE_LABEL,
  REFLECTOR_LABEL,
  RESULTS_TITLE,
  ROTOR_ORDER_LABEL,
} from '../../../constants/labels';
import {
  BRUTE_FORCE_RESULT_CARD,
  COPY_MESSAGE_BUTTON,
  DECRYPTED_TEXT_DISPLAY,
  NEXT_PAGE_BUTTON,
  PAGE_INDICATOR,
  PREVIOUS_PAGE_BUTTON,
} from '../../../constants/selectors';
import { useThemeColors } from '../../../theme/useThemeColors';
import { CopyButton } from '../../atoms/CopyButton';
import { NlpBadge } from '../../molecules/NlpBadge';
import { makeStyles } from './styles';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const formatDerivedPlugboard = (plugboard: Record<string, string>): string => {
  const pairs = Object.entries(plugboard)
    .filter(([key, value]) => key < value)
    .map(([key, value]) => `${key}↔${value}`);
  return pairs.length > 0 ? pairs.join(', ') : '—';
};

const RESULTS_PER_PAGE = 10;

export const CribSearchResults: FunctionComponent<{
  results: CribSearchResult[];
}> = ({ results }) => {
  const [page, setPage] = useState(0);
  const colors = useThemeColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const totalPages = Math.ceil(results.length / RESULTS_PER_PAGE);
  const pageStart = page * RESULTS_PER_PAGE;
  const pageResults = results.slice(pageStart, pageStart + RESULTS_PER_PAGE);

  return (
    <View>
      <Text style={styles.resultsTitle}>{RESULTS_TITLE}</Text>
      {pageResults.map((result, i) => {
        const globalIndex = pageStart + i;
        return (
          <View
            key={`${result.rotorIds.join('-')}-${result.reflectorName}-${result.startingPositions.join('-')}-${result.cribPosition}`}
            testID={`${BRUTE_FORCE_RESULT_CARD}_${globalIndex}`}
            style={styles.resultCard}
          >
            <Text style={styles.resultText}>
              {POSITION_LABEL}: {result.cribPosition}
            </Text>
            <Text style={styles.resultText}>
              {ROTOR_ORDER_LABEL}: {result.rotorIds.join(', ')}
            </Text>
            <Text style={styles.resultText}>
              {REFLECTOR_LABEL}: {result.reflectorName}
            </Text>
            <Text style={styles.resultText}>
              {POSITIONS_LABEL}:{' '}
              {result.startingPositions.map((p) => ALPHABET[p]).join(', ')}
            </Text>
            <Text style={styles.resultText}>
              {DERIVED_PLUGBOARD_LABEL}:{' '}
              {formatDerivedPlugboard(result.derivedPlugboard)}
            </Text>
            <Text
              testID={`${DECRYPTED_TEXT_DISPLAY}_${globalIndex}`}
              style={styles.resultText}
            >
              {DECRYPTED_TEXT_LABEL}: {result.decryptedText}
            </Text>
            <NlpBadge
              score={result.nlpScore}
              testIdSuffix={String(globalIndex)}
            />
            <CopyButton
              text={result.decryptedText}
              testID={`${COPY_MESSAGE_BUTTON}_${globalIndex}`}
            />
          </View>
        );
      })}
      {totalPages > 1 && (
        <View style={styles.paginationRow}>
          <Button
            testID={PREVIOUS_PAGE_BUTTON}
            mode='text'
            onPress={() => setPage(page - 1)}
            disabled={page === 0}
            textColor={colors.accent}
          >
            {PREVIOUS_PAGE_LABEL}
          </Button>
          <Text testID={PAGE_INDICATOR} style={styles.pageIndicator}>
            {PAGE_LABEL} {page + 1} / {totalPages}
          </Text>
          <Button
            testID={NEXT_PAGE_BUTTON}
            mode='text'
            onPress={() => setPage(page + 1)}
            disabled={page >= totalPages - 1}
            textColor={colors.accent}
          >
            {NEXT_PAGE_LABEL}
          </Button>
        </View>
      )}
    </View>
  );
};
