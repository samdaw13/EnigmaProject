import type { FunctionComponent } from 'react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  DECRYPTED_TEXT_LABEL,
  DELETE_LABEL,
  DERIVED_PLUGBOARD_LABEL,
  EMPTY_SAVED_ANALYSES,
  NLP_CONFIDENCE_LABEL,
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
import type { ColorPalette } from '../../../theme/colors';
import { useThemeColors } from '../../../theme/useThemeColors';
import type {
  SavedAnalysis,
  SavedAnalysisResult,
} from '../../../types/interfaces';
import { deleteSavedAnalysis, loadSavedAnalyses } from '../../../utils/storage';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const formatTimestamp = (timestamp: number): string =>
  new Date(timestamp).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

const formatDerivedPlugboard = (plugboard: Record<string, string>): string => {
  const pairs = Object.entries(plugboard)
    .filter(([key, value]) => key < value)
    .map(([key, value]) => `${key}↔${value}`);
  return pairs.length > 0 ? pairs.join(', ') : '—';
};

const nlpBadgeColor = (score: number): string => {
  if (score >= 70) return '#4CAF50';
  if (score >= 40) return '#FFC107';
  return '#F44336';
};

const makeStyles = (colors: ColorPalette, bottomInset: number = 0) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContent: {
      padding: 16,
      paddingBottom: 16 + bottomInset,
    },
    title: {
      color: colors.accent,
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 16,
    },
    card: {
      backgroundColor: colors.surface,
      borderRadius: 8,
      padding: 12,
      marginBottom: 8,
      borderColor: colors.border,
      borderWidth: 1,
    },
    ciphertextPreview: {
      color: colors.textSecondary,
      fontSize: 13,
      letterSpacing: 1,
      marginBottom: 4,
    },
    secondaryText: {
      color: colors.textSecondary,
      fontSize: 12,
      marginBottom: 4,
    },
    text: {
      color: colors.textPrimary,
      fontSize: 14,
      marginBottom: 4,
    },
    resultsTitle: {
      color: colors.accent,
      fontSize: 16,
      fontWeight: 'bold',
      marginTop: 8,
      marginBottom: 8,
    },
    resultCard: {
      backgroundColor: colors.background,
      borderRadius: 6,
      padding: 10,
      marginBottom: 6,
    },
    nlpBadge: {
      borderRadius: 4,
      paddingHorizontal: 8,
      paddingVertical: 4,
      alignSelf: 'flex-start',
      marginTop: 4,
    },
    nlpBadgeText: {
      color: colors.background,
      fontSize: 12,
      fontWeight: 'bold',
    },
    deleteButton: {
      alignSelf: 'flex-start',
      marginTop: 8,
    },
    emptyText: {
      color: colors.textSecondary,
      textAlign: 'center',
      marginTop: 40,
      fontSize: 14,
    },
  });

const ResultCard: FunctionComponent<{
  result: SavedAnalysisResult;
  colors: ColorPalette;
  styles: ReturnType<typeof makeStyles>;
}> = ({ result, colors, styles }) => (
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
      {DERIVED_PLUGBOARD_LABEL}:{' '}
      {formatDerivedPlugboard(result.derivedPlugboard)}
    </Text>
    <Text style={styles.text}>
      {DECRYPTED_TEXT_LABEL}: {result.decryptedText}
    </Text>
    <View
      style={[
        styles.nlpBadge,
        { backgroundColor: nlpBadgeColor(result.nlpScore) },
      ]}
    >
      <Text style={[styles.nlpBadgeText, { color: colors.background }]}>
        {NLP_CONFIDENCE_LABEL}: {result.nlpScore}%
      </Text>
    </View>
  </View>
);

export const SavedAnalyses: FunctionComponent = () => {
  const [analyses, setAnalyses] = useState<SavedAnalysis[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const colors = useThemeColors();
  const { bottom: bottomInset } = useSafeAreaInsets();
  const styles = useMemo(
    () => makeStyles(colors, bottomInset),
    [colors, bottomInset],
  );

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
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.scrollContent}
    >
      <Text style={styles.title}>{SAVED_ANALYSES_TITLE}</Text>
      {analyses.length === 0 && (
        <Text testID={EMPTY_STATE_TEXT} style={styles.emptyText}>
          {EMPTY_SAVED_ANALYSES}
        </Text>
      )}
      {analyses.map((analysis) => (
        <Pressable
          key={analysis.id}
          testID={`${SAVED_ANALYSIS_CARD}_${analysis.id}`}
          style={styles.card}
          onPress={() => toggleExpanded(analysis.id)}
        >
          <Text style={styles.ciphertextPreview} numberOfLines={1}>
            {analysis.ciphertext}
          </Text>
          {analysis.crib.length > 0 && (
            <Text style={styles.secondaryText}>Crib: {analysis.crib}</Text>
          )}
          <Text style={styles.secondaryText}>
            {formatTimestamp(analysis.timestamp)}
          </Text>
          <Text style={styles.secondaryText}>
            {analysis.results.length} {RESULTS_TITLE.toLowerCase()}
          </Text>
          {expandedId === analysis.id && (
            <View>
              {analysis.results.slice(0, 10).map((result) => (
                <ResultCard
                  key={`${result.rotorIds.join('-')}-${result.reflectorName}-${result.startingPositions.join('-')}-${result.cribPosition}`}
                  result={result}
                  colors={colors}
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
            </View>
          )}
        </Pressable>
      ))}
    </ScrollView>
  );
};
