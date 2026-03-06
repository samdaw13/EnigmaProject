import { useNavigation } from '@react-navigation/native';
import type { FunctionComponent } from 'react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button, IconButton, TextInput } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';

import {
  CANCEL_LABEL,
  CIPHERTEXT_LABEL,
  COMMON_CRIBS_HINT,
  CRIB_LABEL,
  DECRYPTED_TEXT_LABEL,
  DERIVED_PLUGBOARD_LABEL,
  INFO_CRIB_ANALYSIS_CONTENT,
  INFO_CRIB_ANALYSIS_TITLE,
  NLP_CONFIDENCE_LABEL,
  NO_CRIB_RESULTS_FALLBACK,
  POSITION_LABEL,
  POSITIONS_LABEL,
  RANKING_RESULTS_LABEL,
  REFLECTOR_LABEL,
  RESULTS_TITLE,
  ROTOR_ORDER_LABEL,
  RUN_ANALYSIS,
  SEARCHING_LABEL,
  TAP_TO_EXPAND,
  VALID_POSITIONS_LABEL,
} from '../../../constants/labels';
import {
  BRUTE_FORCE_RESULT_CARD,
  CANCEL_SEARCH_BUTTON,
  CIPHERTEXT_INPUT,
  COPY_MESSAGE_BUTTON,
  CRIB_INPUT,
  CRIB_POSITION_CARD,
  DECRYPTED_TEXT_DISPLAY,
  INFO_BUTTON,
  NLP_SCORE_DISPLAY,
  PROGRESS_BAR,
  RESULTS_CONTAINER,
  RUN_ANALYSIS_BUTTON,
} from '../../../constants/selectors';
import { searchCancelled } from '../../../features/codeBreaking';
import {
  cancelSearch,
  runCribAnalysis,
} from '../../../features/codeBreaking/searchRunner';
import type { AppDispatch, RootState } from '../../../store/store';
import type { ColorPalette } from '../../../theme/colors';
import { useThemeColors } from '../../../theme/useThemeColors';
import type { CribSearchResult } from '../../../utils/codebreaking';
import { findCribPositions } from '../../../utils/codebreaking';
import { CopyButton } from '../../common';
import { InfoSidebar } from '../../InfoSidebar';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const sanitizeInput = (text: string): string =>
  text
    .toUpperCase()
    .split('')
    .filter((c) => ALPHABET.includes(c))
    .join('');

const formatPositionAlignment = (
  ciphertext: string,
  crib: string,
  position: number,
): string => {
  const padding = ' '.repeat(position);
  return `${ciphertext}\n${padding}${crib}`;
};

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

const makeStyles = (colors: ColorPalette) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.background,
      padding: 16,
    },
    tabs: {
      marginBottom: 16,
    },
    input: {
      marginBottom: 12,
      backgroundColor: colors.surface,
    },
    runButton: {
      marginVertical: 12,
    },
    progressButton: {
      height: 40,
      borderRadius: 20,
      marginVertical: 12,
      overflow: 'hidden',
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.accent,
      justifyContent: 'center',
      alignItems: 'center',
    },
    progressButtonFill: {
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: 0,
      backgroundColor: colors.accent,
    },
    progressButtonLabel: {
      fontSize: 13,
      fontWeight: 'bold',
      letterSpacing: 0.5,
    },
    progressButtonTextClip: {
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: 0,
      overflow: 'hidden',
      justifyContent: 'center',
    },
    cancelButton: {
      marginTop: 4,
      borderColor: colors.border,
    },
    resultsTitle: {
      color: colors.accent,
      fontSize: 18,
      fontWeight: 'bold',
      marginTop: 16,
      marginBottom: 8,
    },
    fallbackHeader: {
      color: colors.textSecondary,
      fontSize: 14,
      fontStyle: 'italic',
      marginTop: 16,
      marginBottom: 4,
    },
    resultCard: {
      backgroundColor: colors.surface,
      borderRadius: 8,
      padding: 12,
      marginBottom: 8,
      borderColor: colors.border,
      borderWidth: 1,
    },
    resultText: {
      color: colors.textPrimary,
      fontSize: 14,
      marginBottom: 4,
    },
    alignmentText: {
      color: colors.textSecondary,
      fontFamily: 'monospace',
      fontSize: 12,
      marginTop: 4,
    },
    hintText: {
      color: colors.textSecondary,
      fontSize: 12,
      marginBottom: 8,
    },
    noResults: {
      color: colors.textSecondary,
      textAlign: 'center',
      marginTop: 16,
      fontSize: 14,
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
  });

const NlpBadge: FunctionComponent<{ score: number; testIdSuffix: string }> = ({
  score,
  testIdSuffix,
}) => {
  const colors = useThemeColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  return (
    <View style={[styles.nlpBadge, { backgroundColor: nlpBadgeColor(score) }]}>
      <Text
        testID={`${NLP_SCORE_DISPLAY}_${testIdSuffix}`}
        style={styles.nlpBadgeText}
      >
        {NLP_CONFIDENCE_LABEL}: {score}%
      </Text>
    </View>
  );
};

const RunButton: FunctionComponent<{
  isSearching: boolean;
  progress: number;
  disabled: boolean;
  onPress: () => void;
}> = ({ isSearching, progress, disabled, onPress }) => {
  const [buttonWidth, setButtonWidth] = useState(0);
  const colors = useThemeColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  if (isSearching) {
    const statusLabel = progress >= 1 ? RANKING_RESULTS_LABEL : SEARCHING_LABEL;
    const fillWidth = Math.min(Math.round(progress * buttonWidth), buttonWidth);
    return (
      <View
        testID={RUN_ANALYSIS_BUTTON}
        style={styles.progressButton}
        onLayout={(e) => setButtonWidth(e.nativeEvent.layout.width)}
      >
        <Text
          style={[styles.progressButtonLabel, { color: colors.textPrimary }]}
        >
          {statusLabel}
        </Text>
        <View
          testID={PROGRESS_BAR}
          style={[styles.progressButtonFill, { width: fillWidth }]}
        />
        <View style={[styles.progressButtonTextClip, { width: fillWidth }]}>
          <View style={{ width: buttonWidth, alignItems: 'center' }}>
            <Text
              style={[styles.progressButtonLabel, { color: colors.background }]}
            >
              {statusLabel}
            </Text>
          </View>
        </View>
      </View>
    );
  }
  return (
    <Button
      testID={RUN_ANALYSIS_BUTTON}
      mode='contained'
      onPress={onPress}
      style={styles.runButton}
      buttonColor={colors.accent}
      textColor={colors.background}
      disabled={disabled}
    >
      {RUN_ANALYSIS}
    </Button>
  );
};

const CribSearchResults: FunctionComponent<{
  results: CribSearchResult[];
}> = ({ results }) => {
  const colors = useThemeColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  return (
    <View>
      <Text style={styles.resultsTitle}>{RESULTS_TITLE}</Text>
      {results.map((result, index) => (
        <View
          key={`${result.rotorIds.join('-')}-${result.reflectorName}-${result.startingPositions.join('-')}-${result.cribPosition}`}
          testID={`${BRUTE_FORCE_RESULT_CARD}_${index}`}
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
            testID={`${DECRYPTED_TEXT_DISPLAY}_${index}`}
            style={styles.resultText}
          >
            {DECRYPTED_TEXT_LABEL}: {result.decryptedText}
          </Text>
          <NlpBadge score={result.nlpScore} testIdSuffix={String(index)} />
          <CopyButton
            text={result.decryptedText}
            testID={`${COPY_MESSAGE_BUTTON}_${index}`}
          />
        </View>
      ))}
    </View>
  );
};

const CribStructuralFallback: FunctionComponent<{
  ciphertext: string;
  crib: string;
  expandedPosition: number | null;
  onTogglePosition: (pos: number) => void;
}> = ({ ciphertext, crib, expandedPosition, onTogglePosition }) => {
  const positions = findCribPositions(ciphertext, crib);
  const colors = useThemeColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  return (
    <View>
      <Text style={styles.fallbackHeader}>{NO_CRIB_RESULTS_FALLBACK}</Text>
      <Text style={styles.resultsTitle}>
        {VALID_POSITIONS_LABEL} ({positions.length})
      </Text>
      <Text style={styles.hintText}>{TAP_TO_EXPAND}</Text>
      {positions.map((pos) => (
        <Pressable
          key={pos}
          testID={`${CRIB_POSITION_CARD}_${pos}`}
          onPress={() => onTogglePosition(pos)}
          style={styles.resultCard}
        >
          <Text style={styles.resultText}>
            {POSITION_LABEL} {pos}
          </Text>
          {expandedPosition === pos && (
            <Text
              testID={`${CRIB_POSITION_CARD}_${pos}_alignment`}
              style={styles.alignmentText}
            >
              {formatPositionAlignment(ciphertext, crib, pos)}
            </Text>
          )}
        </Pressable>
      ))}
    </View>
  );
};

export const BreakCipher: FunctionComponent = () => {
  const dispatch = useDispatch<AppDispatch>();
  const searchStatus = useSelector(
    (state: RootState) => state.codeBreaking.status,
  );
  const searchProgress = useSelector(
    (state: RootState) => state.codeBreaking.progress,
  );
  const cribSearchResults = useSelector(
    (state: RootState) => state.codeBreaking.cribSearchResults,
  );
  const lastCribSearch = useSelector(
    (state: RootState) => state.codeBreaking.lastCribSearch,
  );

  const navigation = useNavigation();
  const [infoVisible, setInfoVisible] = useState(false);
  const [ciphertext, setCiphertext] = useState('');
  const [crib, setCrib] = useState('');
  const [expandedPosition, setExpandedPosition] = useState<number | null>(null);

  const colors = useThemeColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <IconButton
          testID={INFO_BUTTON}
          icon='information'
          iconColor={colors.textSecondary}
          size={22}
          onPress={() => setInfoVisible(true)}
        />
      ),
    });
  }, [navigation, colors.textSecondary, setInfoVisible]);

  const isSearching = searchStatus === 'searching';

  const handleCancel = useCallback(() => {
    cancelSearch();
    dispatch(searchCancelled());
  }, [dispatch]);

  const handleRun = useCallback(() => {
    const sanitizedCiphertext = sanitizeInput(ciphertext);
    const sanitizedCrib = sanitizeInput(crib);
    if (!sanitizedCiphertext || !sanitizedCrib) return;
    runCribAnalysis(sanitizedCiphertext, sanitizedCrib, dispatch);
  }, [ciphertext, crib, dispatch]);

  const toggleExpandedPosition = useCallback(
    (pos: number) => {
      setExpandedPosition(expandedPosition === pos ? null : pos);
    },
    [expandedPosition],
  );

  const sanitizedCiphertextLength = sanitizeInput(ciphertext).length;
  const isCribReady = sanitizedCiphertextLength > 0 && crib.length > 0;
  const runAnalysisButtonDisabled = !isCribReady || isSearching;

  return (
    <ScrollView style={styles.screen}>
      <TextInput
        testID={CIPHERTEXT_INPUT}
        label={CIPHERTEXT_LABEL}
        value={ciphertext}
        onChangeText={(text) => setCiphertext(sanitizeInput(text))}
        mode='outlined'
        autoCapitalize='characters'
        style={styles.input}
        textColor={colors.textPrimary}
        outlineColor={colors.border}
        activeOutlineColor={colors.accent}
        theme={{ colors: { onSurfaceVariant: colors.textSecondary } }}
      />

      <TextInput
        testID={CRIB_INPUT}
        label={CRIB_LABEL}
        value={crib}
        onChangeText={(text) => setCrib(sanitizeInput(text))}
        mode='outlined'
        autoCapitalize='characters'
        style={styles.input}
        textColor={colors.textPrimary}
        outlineColor={colors.border}
        activeOutlineColor={colors.accent}
        theme={{ colors: { onSurfaceVariant: colors.textSecondary } }}
      />

      <Text style={styles.hintText}>{COMMON_CRIBS_HINT}</Text>

      <RunButton
        isSearching={isSearching}
        progress={searchProgress}
        disabled={runAnalysisButtonDisabled}
        onPress={handleRun}
      />

      {isSearching && (
        <Button
          testID={CANCEL_SEARCH_BUTTON}
          mode='outlined'
          onPress={handleCancel}
          style={styles.cancelButton}
          textColor={colors.textSecondary}
        >
          {CANCEL_LABEL}
        </Button>
      )}

      {cribSearchResults !== null &&
        !isSearching &&
        lastCribSearch !== null && (
          <View testID={RESULTS_CONTAINER}>
            {cribSearchResults.length > 0 ? (
              <CribSearchResults results={cribSearchResults} />
            ) : (
              <CribStructuralFallback
                ciphertext={lastCribSearch.ciphertext}
                crib={lastCribSearch.crib}
                expandedPosition={expandedPosition}
                onTogglePosition={toggleExpandedPosition}
              />
            )}
          </View>
        )}
      <InfoSidebar
        visible={infoVisible}
        onDismiss={() => setInfoVisible(false)}
        title={INFO_CRIB_ANALYSIS_TITLE}
        content={INFO_CRIB_ANALYSIS_CONTENT}
      />
    </ScrollView>
  );
};
