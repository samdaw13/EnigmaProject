import type { FunctionComponent } from 'react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  DELETE_LABEL,
  EMPTY_SAVED_MESSAGES,
  POSITIONS_LABEL,
  REFLECTOR_LABEL,
  ROTOR_ORDER_LABEL,
  SAVED_MESSAGES_TITLE,
} from '../../../constants/labels';
import {
  DELETE_SAVED_BUTTON,
  EMPTY_STATE_TEXT,
  SAVED_MESSAGE_CARD,
} from '../../../constants/selectors';
import type { ColorPalette } from '../../../theme/colors';
import { useThemeColors } from '../../../theme/useThemeColors';
import type { SavedMessage } from '../../../types/interfaces';
import { deleteSavedMessage, loadSavedMessages } from '../../../utils/storage';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const formatTimestamp = (timestamp: number): string =>
  new Date(timestamp).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

const formatPlugboard = (cables: Record<string, string>): string => {
  const pairs = Object.entries(cables)
    .filter(([key, value]) => key < value)
    .map(([key, value]) => `${key}↔${value}`);
  return pairs.length > 0 ? pairs.join(', ') : '—';
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
    label: {
      color: colors.accent,
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 4,
    },
    text: {
      color: colors.textPrimary,
      fontSize: 14,
      marginBottom: 4,
    },
    secondaryText: {
      color: colors.textSecondary,
      fontSize: 12,
      marginBottom: 4,
    },
    ciphertextPreview: {
      color: colors.textSecondary,
      fontSize: 13,
      letterSpacing: 1,
      marginBottom: 4,
    },
    detailRow: {
      marginTop: 8,
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

export const SavedMessages: FunctionComponent = () => {
  const [messages, setMessages] = useState<SavedMessage[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const colors = useThemeColors();
  const { bottom: bottomInset } = useSafeAreaInsets();
  const styles = useMemo(
    () => makeStyles(colors, bottomInset),
    [colors, bottomInset],
  );

  useEffect(() => {
    void loadSavedMessages().then(setMessages);
  }, []);

  const handleDelete = useCallback((id: string) => {
    void deleteSavedMessage(id).then((updated) => {
      setMessages(updated);
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
      <Text style={styles.title}>{SAVED_MESSAGES_TITLE}</Text>
      {messages.length === 0 && (
        <Text testID={EMPTY_STATE_TEXT} style={styles.emptyText}>
          {EMPTY_SAVED_MESSAGES}
        </Text>
      )}
      {messages.map((msg) => (
        <Pressable
          key={msg.id}
          testID={`${SAVED_MESSAGE_CARD}_${msg.id}`}
          style={styles.card}
          onPress={() => toggleExpanded(msg.id)}
        >
          <Text style={styles.label}>{msg.label}</Text>
          <Text style={styles.ciphertextPreview} numberOfLines={1}>
            {msg.ciphertext}
          </Text>
          <Text style={styles.secondaryText}>
            {formatTimestamp(msg.timestamp)}
          </Text>
          {expandedId === msg.id && (
            <View style={styles.detailRow}>
              <Text style={styles.text}>
                {ROTOR_ORDER_LABEL}: {msg.rotorIds.join(', ')}
              </Text>
              <Text style={styles.text}>
                {REFLECTOR_LABEL}: {msg.reflectorId}
              </Text>
              <Text style={styles.text}>
                {POSITIONS_LABEL}:{' '}
                {msg.rotorStartingPositions.map((p) => ALPHABET[p]).join(', ')}
              </Text>
              <Text style={styles.text}>
                Plugboard: {formatPlugboard(msg.plugboardCables)}
              </Text>
              <Button
                testID={`${DELETE_SAVED_BUTTON}_${msg.id}`}
                mode='text'
                compact
                textColor={colors.destructive}
                style={styles.deleteButton}
                onPress={() => handleDelete(msg.id)}
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
