import React, { FunctionComponent, useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import {
  Button,
  ProgressBar,
  SegmentedButtons,
  TextInput,
} from 'react-native-paper';

import {
  BRUTE_FORCE_TAB,
  CIPHERTEXT_LABEL,
  COMMON_CRIBS_HINT,
  CRIB_ANALYSIS_TAB,
  CRIB_LABEL,
  KNOWN_PLAINTEXT_HINT,
  KNOWN_PLAINTEXT_LABEL,
  NO_RESULTS,
  POSITION_LABEL,
  POSITIONS_LABEL,
  REFLECTOR_LABEL,
  RESULTS_TITLE,
  ROTOR_ORDER_LABEL,
  RUN_ANALYSIS,
  RUNNING_ANALYSIS,
  SEARCHING_LABEL,
  TAP_TO_EXPAND,
  VALID_POSITIONS_LABEL,
} from '../../../constants/labels';
import {
  BRUTE_FORCE_TAB_BUTTON,
  CIPHERTEXT_INPUT,
  CRIB_ANALYSIS_TAB_BUTTON,
  CRIB_INPUT,
  CRIB_POSITION_CARD,
  PLAINTEXT_INPUT,
  PROGRESS_BAR,
  RESULTS_CONTAINER,
  RUN_ANALYSIS_BUTTON,
  SEARCHING_INDICATOR,
} from '../../../constants/selectors';
import { initialReflectorState } from '../../../features/reflector';
import { initialRotorState } from '../../../features/rotors/features';
import { colors } from '../../../theme/colors';
import {
  BruteForceResult,
  bruteForceSearchAsync,
  findCribPositions,
} from '../../../utils/codebreaking';

type Tab = 'bruteForce' | 'cribAnalysis';

interface CribResult {
  positions: number[];
  ciphertext: string;
  crib: string;
}

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

const BruteForceResults: FunctionComponent<{
  results: BruteForceResult[];
}> = ({ results }) => (
  <View>
    <Text style={styles.resultsTitle}>{RESULTS_TITLE}</Text>
    {results.map((result, index) => (
      <View key={index} style={styles.resultCard}>
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
      </View>
    ))}
  </View>
);

const CribResults: FunctionComponent<{
  result: CribResult;
  expandedPosition: number | null;
  onTogglePosition: (pos: number) => void;
}> = ({ result, expandedPosition, onTogglePosition }) => (
  <View>
    <Text style={styles.resultsTitle}>
      {VALID_POSITIONS_LABEL} ({result.positions.length})
    </Text>
    <Text style={styles.hintText}>{TAP_TO_EXPAND}</Text>
    {result.positions.map((pos) => (
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
            {formatPositionAlignment(result.ciphertext, result.crib, pos)}
          </Text>
        )}
      </Pressable>
    ))}
  </View>
);

export const BreakCipher: FunctionComponent = () => {
  const [activeTab, setActiveTab] = useState<Tab>('bruteForce');
  const [ciphertext, setCiphertext] = useState('');
  const [plaintext, setPlaintext] = useState('');
  const [crib, setCrib] = useState('');
  const [bruteForceResults, setBruteForceResults] = useState<
    BruteForceResult[] | null
  >(null);
  const [cribResults, setCribResults] = useState<CribResult | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [progress, setProgress] = useState(0);
  const [expandedPosition, setExpandedPosition] = useState<number | null>(null);

  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value as Tab);
    setBruteForceResults(null);
    setCribResults(null);
    setProgress(0);
    setExpandedPosition(null);
  }, []);

  const runBruteForce = useCallback(async () => {
    const sanitizedCiphertext = sanitizeInput(ciphertext);
    const sanitizedPlaintext = sanitizeInput(plaintext);
    if (!sanitizedCiphertext || !sanitizedPlaintext) return;

    setIsSearching(true);
    setBruteForceResults(null);
    setProgress(0);

    const results = await bruteForceSearchAsync(
      sanitizedCiphertext,
      sanitizedPlaintext,
      initialRotorState.available,
      initialReflectorState.reflectors,
      setProgress,
    );
    setBruteForceResults(results);
    setIsSearching(false);
  }, [ciphertext, plaintext]);

  const runCribAnalysis = useCallback(() => {
    const sanitizedCiphertext = sanitizeInput(ciphertext);
    const sanitizedCrib = sanitizeInput(crib);
    if (!sanitizedCiphertext || !sanitizedCrib) return;

    setProgress(0);
    const positions = findCribPositions(sanitizedCiphertext, sanitizedCrib);
    setCribResults({
      positions,
      ciphertext: sanitizedCiphertext,
      crib: sanitizedCrib,
    });
    setProgress(1);
    setExpandedPosition(null);
  }, [ciphertext, crib]);

  const handleRun = useCallback(() => {
    if (activeTab === 'bruteForce') {
      void runBruteForce();
    } else {
      runCribAnalysis();
    }
  }, [activeTab, runBruteForce, runCribAnalysis]);

  const toggleExpandedPosition = useCallback(
    (pos: number) => {
      setExpandedPosition(expandedPosition === pos ? null : pos);
    },
    [expandedPosition],
  );

  const hasResults =
    activeTab === 'bruteForce'
      ? bruteForceResults !== null
      : cribResults !== null;
  const hasNoResults =
    (activeTab === 'bruteForce' &&
      bruteForceResults !== null &&
      bruteForceResults.length === 0) ||
    (activeTab === 'cribAnalysis' &&
      cribResults !== null &&
      cribResults.positions.length === 0);

  const hintText =
    activeTab === 'bruteForce' ? KNOWN_PLAINTEXT_HINT : COMMON_CRIBS_HINT;
  const isCribTextSet = activeTab === 'cribAnalysis' && crib.length > 0;
  const isBruteForceTextSet =
    activeTab === 'bruteForce' && plaintext.length > 0;
  const areInputsEmpty =
    ciphertext.length === 0 || (!isCribTextSet && !isBruteForceTextSet);
  const runAnalysisButtonDisabled = areInputsEmpty || isSearching;
  const runAnalysisButtonText = isSearching ? RUNNING_ANALYSIS : RUN_ANALYSIS;

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

      <Button
        testID={RUN_ANALYSIS_BUTTON}
        mode='contained'
        onPress={handleRun}
        style={styles.runButton}
        buttonColor={colors.accent}
        textColor={colors.background}
        disabled={runAnalysisButtonDisabled}
      >
        {runAnalysisButtonText}
      </Button>

      {isSearching && (
        <>
          <Text testID={SEARCHING_INDICATOR} style={styles.searchingText}>
            {SEARCHING_LABEL}
          </Text>
          <ProgressBar
            testID={PROGRESS_BAR}
            progress={progress}
            color={colors.accent}
            style={styles.progressBar}
          />
        </>
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
            cribResults &&
            cribResults.positions.length > 0 && (
              <CribResults
                result={cribResults}
                expandedPosition={expandedPosition}
                onTogglePosition={toggleExpandedPosition}
              />
            )}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
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
  searchingText: {
    color: colors.accent,
    textAlign: 'center',
    marginTop: 16,
    fontSize: 16,
  },
  progressBar: {
    marginTop: 8,
    borderRadius: 4,
    backgroundColor: colors.surface,
  },
  resultsTitle: {
    color: colors.accent,
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
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
});
