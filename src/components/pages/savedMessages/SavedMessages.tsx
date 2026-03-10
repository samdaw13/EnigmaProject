import type { FunctionComponent } from 'react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Text, View } from 'react-native';
import { Button } from 'react-native-paper';

import { ALPHABET } from '../../../constants';
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
import { formatPlugboard, formatTimestamp } from '../../../formatters';
import { useThemeColors } from '../../../theme/useThemeColors';
import type { SavedMessage } from '../../../types/interfaces';
import { deleteSavedMessage, loadSavedMessages } from '../../../utils/storage';
import { ExpandableCard } from '../../molecules/ExpandableCard';
import { Page } from '../../templates/Page';
import { makeStyles } from './styles';

export const SavedMessages: FunctionComponent = () => {
  const [messages, setMessages] = useState<SavedMessage[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const colors = useThemeColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);

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
    <Page contentContainerStyle={styles.scrollContent}>
      <Text style={styles.title}>{SAVED_MESSAGES_TITLE}</Text>
      {messages.length === 0 && (
        <Text testID={EMPTY_STATE_TEXT} style={styles.emptyText}>
          {EMPTY_SAVED_MESSAGES}
        </Text>
      )}
      {messages.map((msg) => (
        <ExpandableCard
          key={msg.id}
          testID={`${SAVED_MESSAGE_CARD}_${msg.id}`}
          expanded={expandedId === msg.id}
          onPress={() => toggleExpanded(msg.id)}
          header={
            <>
              <Text style={styles.label}>{msg.label}</Text>
              <Text style={styles.ciphertextPreview} numberOfLines={1}>
                {msg.ciphertext}
              </Text>
              <Text style={styles.secondaryText}>
                {formatTimestamp(msg.timestamp)}
              </Text>
            </>
          }
        >
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
        </ExpandableCard>
      ))}
    </Page>
  );
};
