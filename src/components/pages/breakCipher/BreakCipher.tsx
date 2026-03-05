import type { FunctionComponent } from 'react';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button, SegmentedButtons, TextInput } from 'react-native-paper';

import {
  BRUTE_FORCE_TAB,
  CANCEL_LABEL,
  CIPHERTEXT_LABEL,
  CIPHERTEXT_TOO_LONG,
  COMMON_CRIBS_HINT,
  CRIB_ANALYSIS_TAB,
  CRIB_LABEL,
  DECRYPTED_TEXT_LABEL,
  KNOWN_PLAINTEXT_LABEL,
  KNOWN_PLAINTEXT_OPTIONAL_HINT,
  NLP_CONFIDENCE_LABEL,
  NO_CRIB_RESULTS_FALLBACK,
  NO_RESULTS,
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
  BRUTE_FORCE_TAB_BUTTON,
  CANCEL_SEARCH_BUTTON,
  CIPHERTEXT_INPUT,
  CRIB_ANALYSIS_TAB_BUTTON,
  CRIB_INPUT,
  CRIB_POSITION_CARD,
  DECRYPTED_TEXT_DISPLAY,
  NLP_SCORE_DISPLAY,
  PLAINTEXT_INPUT,
  PROGRESS_BAR,
  RESULTS_CONTAINER,
  RUN_ANALYSIS_BUTTON,
} from '../../../constants/selectors';
import { initialReflectorState } from '../../../features/reflector';
import { initialRotorState } from '../../../features/rotors/features';
import { ColorPalette } from '../../../theme/colors';
import { useThemeColors } from '../../../theme/useThemeColors';
import type {
  BruteForceResult,
  CribSearchResult,
} from '../../../utils/codebreaking';
import {
  bruteForceSearchAsync,
  cribSearchAsync,
  findCribPositions,
} from '../../../utils/codebreaking';

type Tab = 'bruteForce' | 'cribAnalysis';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const BRUTE_FORCE_MAX_KEYLESS_LENGTH = 50;

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
    errorText: {
      color: colors.destructive,
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

const BruteForceResults: FunctionComponent<{
  results: BruteForceResult[];
}> = ({ results }) => {
  const colors = useThemeColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  return (
    <View>
      <Text style={styles.resultsTitle}>{RESULTS_TITLE}</Text>
      {results.map((result, index) => (
        <View
          key={index}
          testID={`${BRUTE_FORCE_RESULT_CARD}_${index}`}
          style={styles.resultCard}
        >
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
          <Text
            testID={`${DECRYPTED_TEXT_DISPLAY}_${index}`}
            style={styles.resultText}
          >
            {DECRYPTED_TEXT_LABEL}: {result.decryptedText}
          </Text>
          <NlpBadge score={result.nlpScore} testIdSuffix={String(index)} />
        </View>
      ))}
    </View>
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
          key={index}
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
          <Text
            testID={`${DECRYPTED_TEXT_DISPLAY}_${index}`}
            style={styles.resultText}
          >
            {DECRYPTED_TEXT_LABEL}: {result.decryptedText}
          </Text>
          <NlpBadge score={result.nlpScore} testIdSuffix={String(index)} />
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
  const [activeTab, setActiveTab] = useState<Tab>('bruteForce');
  const [ciphertext, setCiphertext] = useState('');
  const [plaintext, setPlaintext] = useState('');
  const [crib, setCrib] = useState('');
  const [bruteForceResults, setBruteForceResults] = useState<
    BruteForceResult[] | null
  >(null);
  const [cribSearchResults, setCribSearchResults] = useState<
    CribSearchResult[] | null
  >(null);
  const [lastCribSearch, setLastCribSearch] = useState<{
    ciphertext: string;
    crib: string;
  } | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [progress, setProgress] = useState(0);
  const [expandedPosition, setExpandedPosition] = useState<number | null>(null);
  const cancelledRef = useRef(false);
  const colors = useThemeColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const handleCancel = useCallback(() => {
    cancelledRef.current = true;
    setIsSearching(false);
    setProgress(0);
  }, []);

  const handleTabChange = useCallback((value: string) => {
    cancelledRef.current = true;
    setIsSearching(false);
    setActiveTab(value as Tab);
    setBruteForceResults(null);
    setCribSearchResults(null);
    setLastCribSearch(null);
    setProgress(0);
    setExpandedPosition(null);
  }, []);

  const runBruteForce = useCallback(async () => {
    const sanitizedCiphertext = sanitizeInput(ciphertext);
    if (!sanitizedCiphertext) return;

    cancelledRef.current = false;
    setIsSearching(true);
    setBruteForceResults(null);
    setProgress(0);

    const sanitizedPlaintext =
      plaintext.length > 0 ? sanitizeInput(plaintext) : undefined;

    const results = await bruteForceSearchAsync(
      sanitizedCiphertext,
      sanitizedPlaintext,
      initialRotorState.available,
      initialReflectorState.reflectors,
      setProgress,
      () => cancelledRef.current,
    );
    if (cancelledRef.current) return;
    setBruteForceResults(results);
    setIsSearching(false);
  }, [ciphertext, plaintext]);

  const runCribAnalysis = useCallback(async () => {
    const sanitizedCiphertext = sanitizeInput(ciphertext);
    const sanitizedCrib = sanitizeInput(crib);
    if (!sanitizedCiphertext || !sanitizedCrib) return;

    cancelledRef.current = false;
    setIsSearching(true);
    setCribSearchResults(null);
    setLastCribSearch(null);
    setProgress(0);
    setExpandedPosition(null);

    const results = await cribSearchAsync(
      sanitizedCiphertext,
      sanitizedCrib,
      initialRotorState.available,
      initialReflectorState.reflectors,
      setProgress,
      () => cancelledRef.current,
    );
    if (cancelledRef.current) return;
    setCribSearchResults(results);
    setLastCribSearch({ ciphertext: sanitizedCiphertext, crib: sanitizedCrib });
    setIsSearching(false);
  }, [ciphertext, crib]);

  const handleRun = useCallback(() => {
    if (activeTab === 'bruteForce') {
      void runBruteForce();
    } else {
      void runCribAnalysis();
    }
  }, [activeTab, runBruteForce, runCribAnalysis]);

  const toggleExpandedPosition = useCallback(
    (pos: number) => {
      setExpandedPosition(expandedPosition === pos ? null : pos);
    },
    [expandedPosition],
  );

  const sanitizedCiphertextLength = sanitizeInput(ciphertext).length;
  const isBruteForceWithoutPlaintext =
    activeTab === 'bruteForce' && plaintext.length === 0;
  const ciphertextTooLong =
    isBruteForceWithoutPlaintext &&
    sanitizedCiphertextLength > BRUTE_FORCE_MAX_KEYLESS_LENGTH;

  const isBruteForceReady =
    activeTab === 'bruteForce' && sanitizedCiphertextLength > 0;
  const isCribReady =
    activeTab === 'cribAnalysis' &&
    sanitizedCiphertextLength > 0 &&
    crib.length > 0;
  const areInputsEmpty = !isBruteForceReady && !isCribReady;
  const runAnalysisButtonDisabled =
    areInputsEmpty || isSearching || ciphertextTooLong;

  const hasResults =
    activeTab === 'bruteForce'
      ? bruteForceResults !== null
      : cribSearchResults !== null;
  const hasNoResults =
    activeTab === 'bruteForce' &&
    bruteForceResults !== null &&
    bruteForceResults.length === 0;

  const hintText =
    activeTab === 'bruteForce'
      ? KNOWN_PLAINTEXT_OPTIONAL_HINT
      : COMMON_CRIBS_HINT;

  return (
    <ScrollView style={styles.screen}>
      <SegmentedButtons
        value={activeTab}
        onValueChange={handleTabChange}
        buttons={[
          {
            value: 'bruteForce',
            label: BRUTE_FORCE_TAB,
            testID: BRUTE_FORCE_TAB_BUTTON,
          },
          {
            value: 'cribAnalysis',
            label: CRIB_ANALYSIS_TAB,
            testID: CRIB_ANALYSIS_TAB_BUTTON,
          },
        ]}
        style={styles.tabs}
        theme={{
          colors: {
            secondaryContainer: colors.surfaceAlt,
            onSecondaryContainer: colors.accent,
            onSurface: colors.textSecondary,
            outline: colors.border,
          },
        }}
      />

      <TextInput
        testID={CIPHERTEXT_INPUT}
        label={CIPHERTEXT_LABEL}
        value={ciphertext}
        onChangeText={setCiphertext}
        mode='outlined'
        autoCapitalize='characters'
        style={styles.input}
        textColor={colors.textPrimary}
        outlineColor={colors.border}
        activeOutlineColor={colors.accent}
        theme={{ colors: { onSurfaceVariant: colors.textSecondary } }}
      />

      {activeTab === 'bruteForce' ? (
        <TextInput
          testID={PLAINTEXT_INPUT}
          label={KNOWN_PLAINTEXT_LABEL}
          value={plaintext}
          onChangeText={setPlaintext}
          mode='outlined'
          autoCapitalize='characters'
          style={styles.input}
          textColor={colors.textPrimary}
          outlineColor={colors.border}
          activeOutlineColor={colors.accent}
          theme={{ colors: { onSurfaceVariant: colors.textSecondary } }}
        />
      ) : (
        <TextInput
          testID={CRIB_INPUT}
          label={CRIB_LABEL}
          value={crib}
          onChangeText={setCrib}
          mode='outlined'
          autoCapitalize='characters'
          style={styles.input}
          textColor={colors.textPrimary}
          outlineColor={colors.border}
          activeOutlineColor={colors.accent}
          theme={{ colors: { onSurfaceVariant: colors.textSecondary } }}
        />
      )}

      <Text style={styles.hintText}>{hintText}</Text>

      {ciphertextTooLong && (
        <Text style={styles.errorText}>{CIPHERTEXT_TOO_LONG}</Text>
      )}

      <RunButton
        isSearching={isSearching}
        progress={progress}
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

      {hasResults && !isSearching && (
        <View testID={RESULTS_CONTAINER}>
          {hasNoResults && <Text style={styles.noResults}>{NO_RESULTS}</Text>}

          {activeTab === 'bruteForce' &&
            bruteForceResults &&
            bruteForceResults.length > 0 && (
              <BruteForceResults results={bruteForceResults} />
            )}

          {activeTab === 'cribAnalysis' &&
            cribSearchResults !== null &&
            lastCribSearch !== null && (
              <>
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
              </>
            )}
        </View>
      )}
    </ScrollView>
  );
};
