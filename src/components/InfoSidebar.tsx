import type { FunctionComponent } from 'react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Animated,
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { IconButton } from 'react-native-paper';

import { INFO_SIDEBAR, INFO_SIDEBAR_CLOSE } from '../constants/selectors';
import type { ColorPalette } from '../theme/colors';
import { useThemeColors } from '../theme/useThemeColors';

interface InfoSidebarProps {
  visible: boolean;
  onDismiss: () => void;
  title: string;
  content: string;
}

const SIDEBAR_WIDTH_FRACTION = 0.82;

const makeStyles = (colors: ColorPalette, sidebarWidth: number) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      flexDirection: 'row',
    },
    backdrop: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.45)',
    },
    sidebar: {
      width: sidebarWidth,
      backgroundColor: colors.surface,
      paddingHorizontal: 20,
      paddingTop: 48,
      paddingBottom: 20,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 12,
    },
    title: {
      color: colors.accent,
      fontSize: 18,
      fontWeight: 'bold',
      flex: 1,
    },
    body: {
      color: colors.textPrimary,
      fontSize: 14,
      lineHeight: 22,
    },
  });

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
        <Pressable style={styles.backdrop} onPress={dismiss} />
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
