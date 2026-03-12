import type { FunctionComponent } from 'react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Animated,
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { IconButton } from 'react-native-paper';

import { INFO_SIDEBAR, INFO_SIDEBAR_CLOSE } from '../../../constants/selectors';
import { useThemeColors } from '../../../theme/useThemeColors';
import { makeStyles, SIDEBAR_WIDTH_FRACTION } from './styles';

interface InfoSidebarProps {
  visible: boolean;
  onDismiss: () => void;
  title: string;
  content: string;
}

export const InfoSidebar: FunctionComponent<InfoSidebarProps> = ({
  visible,
  onDismiss,
  title,
  content,
}) => {
  const colors = useThemeColors();
  const sidebarWidth = Dimensions.get('window').width * SIDEBAR_WIDTH_FRACTION;
  const styles = useMemo(
    () => makeStyles(colors, sidebarWidth),
    [colors, sidebarWidth],
  );
  const [translateX] = useState(() => new Animated.Value(sidebarWidth));

  useEffect(() => {
    if (visible) {
      translateX.setValue(sidebarWidth);
      Animated.timing(translateX, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, translateX, sidebarWidth]);

  const dismiss = useCallback(() => {
    Animated.timing(translateX, {
      toValue: sidebarWidth,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      onDismiss();
    });
  }, [translateX, sidebarWidth, onDismiss]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType='none'
      onRequestClose={dismiss}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={dismiss} role='none' />
        <Animated.View
          testID={INFO_SIDEBAR}
          style={[styles.sidebar, { transform: [{ translateX }] }]}
        >
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <IconButton
              testID={INFO_SIDEBAR_CLOSE}
              icon='close'
              iconColor={colors.textSecondary}
              size={20}
              onPress={dismiss}
            />
          </View>
          <ScrollView>
            <Text style={styles.body}>{content}</Text>
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
};
