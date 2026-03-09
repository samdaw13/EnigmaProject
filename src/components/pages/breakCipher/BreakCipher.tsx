import { useNavigation } from '@react-navigation/native';
import type { FunctionComponent } from 'react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Button, IconButton, TextInput } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';

import {
  CANCEL_LABEL,
  CIPHERTEXT_LABEL,
  COMMON_CRIBS_HINT,
  CRIB_LABEL,
  CRIB_POSITION_LABEL,
  INFO_CRIB_ANALYSIS_CONTENT,
  INFO_CRIB_ANALYSIS_TITLE,
  SAVE_RESULTS_LABEL,
} from '../../../constants/labels';
import {
  CANCEL_SEARCH_BUTTON,
  CIPHERTEXT_INPUT,
  CRIB_INPUT,
  CRIB_POSITION_INPUT,
  INFO_BUTTON,
  RESULTS_CONTAINER,
  SAVE_RESULTS_BUTTON,
} from '../../../constants/selectors';
import { searchCancelled } from '../../../features/codeBreaking';
import {
  cancelSearch,
  runCribAnalysis,
} from '../../../features/codeBreaking/searchRunner';
import type { AppDispatch, RootState } from '../../../store/store';
import { useThemeColors } from '../../../theme/useThemeColors';
import type { SavedAnalysis } from '../../../types/interfaces';
import { addSavedAnalysis } from '../../../utils/storage';
import { InfoSidebar } from '../../molecules/InfoSidebar';
import { RunButton } from '../../molecules/RunButton';
import { CribSearchResults } from '../../organisms/CribSearchResults';
import { CribStructuralFallback } from '../../organisms/CribStructuralFallback';
import { makeStyles } from './styles';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const sanitizeInput = (text: string): string =>
  text
    .toUpperCase()
    .split('')
    .filter((c) => ALPHABET.includes(c))
    .join('');

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
  const [cribPosition, setCribPosition] = useState('');
  const [expandedPosition, setExpandedPosition] = useState<number | null>(null);

  const colors = useThemeColors();
  const { bottom: bottomInset } = useSafeAreaInsets();
  const styles = useMemo(
    () => makeStyles(colors, bottomInset),
    [colors, bottomInset],
  );

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

  const parsedCribPosition = useMemo(() => {
    const trimmed = cribPosition.trim();
    if (trimmed === '') return undefined;
    const parsed = parseInt(trimmed, 10);
    return Number.isNaN(parsed) || parsed < 0 ? undefined : parsed;
  }, [cribPosition]);

  const handleRun = useCallback(() => {
    const sanitizedCiphertext = sanitizeInput(ciphertext);
    const sanitizedCrib = sanitizeInput(crib);
    if (!sanitizedCiphertext || !sanitizedCrib) return;
    runCribAnalysis(
      sanitizedCiphertext,
      sanitizedCrib,
      dispatch,
      parsedCribPosition,
    );
  }, [ciphertext, crib, dispatch, parsedCribPosition]);

  const toggleExpandedPosition = useCallback(
    (pos: number) => {
      setExpandedPosition(expandedPosition === pos ? null : pos);
    },
    [expandedPosition],
  );

  const handleSaveResults = useCallback(() => {
    if (!cribSearchResults || !lastCribSearch) return;
    const analysis: SavedAnalysis = {
      id: Date.now().toString(),
      ciphertext: lastCribSearch.ciphertext,
      crib: lastCribSearch.crib,
      results: cribSearchResults.map((r) => ({
        rotorIds: r.rotorIds,
        reflectorName: r.reflectorName,
        startingPositions: r.startingPositions,
        cribPosition: r.cribPosition,
        decryptedText: r.decryptedText,
        nlpScore: r.nlpScore,
        derivedPlugboard: r.derivedPlugboard,
      })),
      timestamp: Date.now(),
    };
    void addSavedAnalysis(analysis);
  }, [cribSearchResults, lastCribSearch]);

  const sanitizedCiphertextLength = sanitizeInput(ciphertext).length;
  const isCribReady = sanitizedCiphertextLength > 0 && crib.length > 0;
  const runAnalysisButtonDisabled = !isCribReady || isSearching;

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.contentContainer}
    >
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

      <TextInput
        testID={CRIB_POSITION_INPUT}
        label={CRIB_POSITION_LABEL}
        value={cribPosition}
        onChangeText={setCribPosition}
        mode='outlined'
        keyboardType='number-pad'
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
              <>
                <CribSearchResults results={cribSearchResults} />
                <Button
                  testID={SAVE_RESULTS_BUTTON}
                  mode='contained'
                  onPress={handleSaveResults}
                  style={styles.saveButton}
                  buttonColor={colors.accent}
                  textColor={colors.background}
                >
                  {SAVE_RESULTS_LABEL}
                </Button>
              </>
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
