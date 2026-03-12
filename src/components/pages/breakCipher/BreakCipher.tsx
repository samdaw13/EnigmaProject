import { useNavigation } from '@react-navigation/native';
import type { FunctionComponent } from 'react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Text, View } from 'react-native';
import { Button, IconButton, TextInput } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';

import { ALPHABET } from '../../../constants';
import {
  CANCEL_LABEL,
  CIPHERTEXT_LABEL,
  COMMON_CRIBS_HINT,
  CRIB_LABEL,
  CRIB_POSITION_BUTTON_LABEL,
  INFO_CRIB_ANALYSIS_CONTENT,
  INFO_CRIB_ANALYSIS_TITLE,
  POSITION_LABEL,
  SAVE_RESULTS_LABEL,
} from '../../../constants/labels';
import {
  CANCEL_SEARCH_BUTTON,
  CIPHERTEXT_INPUT,
  CRIB_INPUT,
  CRIB_POSITION_BUTTON,
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
import { CribPositionModal } from '../../molecules/CribPositionModal';
import { InfoSidebar } from '../../molecules/InfoSidebar';
import { RunButton } from '../../molecules/RunButton';
import { CribSearchResults } from '../../organisms/CribSearchResults';
import { CribStructuralFallback } from '../../organisms/CribStructuralFallback';
import { Page } from '../../templates/Page';
import { makeStyles } from './styles';

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
  const [cribPosition, setCribPosition] = useState<number | undefined>(
    undefined,
  );
  const [cribModalVisible, setCribModalVisible] = useState(false);
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
    runCribAnalysis(sanitizedCiphertext, sanitizedCrib, dispatch, cribPosition);
  }, [ciphertext, crib, dispatch, cribPosition]);

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
    <Page contentContainerStyle={styles.contentContainer}>
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
        theme={{
          colors: {
            onSurfaceVariant: colors.textSecondary,
            background: cribModalVisible ? 'transparent' : colors.surface,
          },
        }}
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
        theme={{
          colors: {
            onSurfaceVariant: colors.textSecondary,
            background: cribModalVisible ? 'transparent' : colors.surface,
          },
        }}
      />

      <Button
        testID={CRIB_POSITION_BUTTON}
        mode='outlined'
        onPress={() => setCribModalVisible(true)}
        disabled={!isCribReady}
        style={styles.positionButton}
        textColor={colors.textPrimary}
        icon={
          cribPosition !== undefined
            ? 'check-circle-outline'
            : 'cursor-default-click-outline'
        }
        theme={{
          colors: {
            surfaceDisabled: colors.disabledSurface,
            onSurfaceDisabled: colors.disabledText,
          },
        }}
      >
        {cribPosition !== undefined
          ? `${POSITION_LABEL}: ${cribPosition + 1}`
          : CRIB_POSITION_BUTTON_LABEL}
      </Button>

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

      <CribPositionModal
        visible={cribModalVisible}
        onDismiss={() => setCribModalVisible(false)}
        ciphertext={sanitizeInput(ciphertext)}
        crib={sanitizeInput(crib)}
        currentPosition={cribPosition}
        onConfirm={setCribPosition}
        onClear={() => setCribPosition(undefined)}
      />
    </Page>
  );
};
