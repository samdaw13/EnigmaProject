import type { FunctionComponent } from 'react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Text, View } from 'react-native';
import { Button } from 'react-native-paper';

import { ALPHABET } from '../../../constants';
import {
  CRIB_PREFIX_LABEL,
  DECRYPTED_TEXT_LABEL,
  DELETE_LABEL,
  DERIVED_PLUGBOARD_LABEL,
  EMPTY_SAVED_ANALYSES,
  POSITION_LABEL,
  POSITIONS_LABEL,
  REFLECTOR_LABEL,
  RESULTS_TITLE,
  ROTOR_ORDER_LABEL,
  SAVED_ANALYSES_TITLE,
} from '../../../constants/labels';
import {
  DELETE_SAVED_BUTTON,
  EMPTY_STATE_TEXT,
  SAVED_ANALYSIS_CARD,
} from '../../../constants/selectors';
import { formatPlugboard, formatTimestamp } from '../../../formatters';
import { useThemeColors } from '../../../theme/useThemeColors';
import type {
  SavedAnalysis,
  SavedAnalysisResult,
} from '../../../types/interfaces';
import { deleteSavedAnalysis, loadSavedAnalyses } from '../../../utils/storage';
import { ExpandableCard } from '../../molecules/ExpandableCard';
import { NlpBadge } from '../../molecules/NlpBadge';
import { Page } from '../../templates/Page';
import { makeStyles } from './styles';

const ResultCard: FunctionComponent<{
  result: SavedAnalysisResult;
  styles: ReturnType<typeof makeStyles>;
}> = ({ result, styles }) => (
  <View style={styles.resultCard}>
    <Text style={styles.text}>
      {POSITION_LABEL}: {result.cribPosition}
    </Text>
    <Text style={styles.text}>
      {ROTOR_ORDER_LABEL}: {result.rotorIds.join(', ')}
    </Text>
    <Text style={styles.text}>
      {REFLECTOR_LABEL}: {result.reflectorName}
    </Text>
    <Text style={styles.text}>
      {POSITIONS_LABEL}:{' '}
      {result.startingPositions.map((p) => ALPHABET[p]).join(', ')}
    </Text>
    <Text style={styles.text}>
      {DERIVED_PLUGBOARD_LABEL}: {formatPlugboard(result.derivedPlugboard)}
    </Text>
    <Text style={styles.text}>
      {DECRYPTED_TEXT_LABEL}: {result.decryptedText}
    </Text>
    <NlpBadge score={result.nlpScore} />
  </View>
);

export const SavedAnalyses: FunctionComponent = () => {
  const [analyses, setAnalyses] = useState<SavedAnalysis[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const colors = useThemeColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  useEffect(() => {
    void loadSavedAnalyses().then(setAnalyses);
  }, []);

  const handleDelete = useCallback((id: string) => {
    void deleteSavedAnalysis(id).then((updated) => {
      setAnalyses(updated);
      setExpandedId(null);
    });
  }, []);

  const toggleExpanded = useCallback(
    (id: string) => {
      setExpandedId(expandedId === id ? null : id);
    },
    [expandedId],
  );

  return (
    <Page contentContainerStyle={styles.scrollContent}>
      <Text style={styles.title}>{SAVED_ANALYSES_TITLE}</Text>
      {analyses.length === 0 && (
        <Text testID={EMPTY_STATE_TEXT} style={styles.emptyText}>
          {EMPTY_SAVED_ANALYSES}
        </Text>
      )}
      {analyses.map((analysis) => (
        <ExpandableCard
          key={analysis.id}
          testID={`${SAVED_ANALYSIS_CARD}_${analysis.id}`}
          expanded={expandedId === analysis.id}
          onPress={() => toggleExpanded(analysis.id)}
          header={
            <>
              <Text style={styles.ciphertextPreview} numberOfLines={1}>
                {analysis.ciphertext}
              </Text>
              {analysis.crib.length > 0 && (
                <Text style={styles.secondaryText}>
                  {CRIB_PREFIX_LABEL}: {analysis.crib}
                </Text>
              )}
              <Text style={styles.secondaryText}>
                {formatTimestamp(analysis.timestamp)}
              </Text>
              <Text style={styles.secondaryText}>
                {analysis.results.length} {RESULTS_TITLE.toLowerCase()}
              </Text>
            </>
          }
        >
          {analysis.results.map((result) => (
            <ResultCard
              key={`${result.rotorIds.join('-')}-${result.reflectorName}-${result.startingPositions.join('-')}-${result.cribPosition}`}
              result={result}
              styles={styles}
            />
          ))}
          <Button
            testID={`${DELETE_SAVED_BUTTON}_${analysis.id}`}
            mode='text'
            compact
            textColor={colors.destructive}
            style={styles.deleteButton}
            onPress={() => handleDelete(analysis.id)}
          >
            {DELETE_LABEL}
          </Button>
        </ExpandableCard>
      ))}
    </Page>
  );
};
