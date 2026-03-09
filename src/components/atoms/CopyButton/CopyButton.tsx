import Clipboard from '@react-native-clipboard/clipboard';
import type { FunctionComponent } from 'react';
import React, { useState } from 'react';
import { Button } from 'react-native-paper';

import {
  COPIED_MESSAGE,
  COPY_MESSAGE,
  COPY_MESSAGE_BUTTON,
} from '../../../constants';
import { useThemeColors } from '../../../theme/useThemeColors';

interface CopyButtonProps {
  text: string;
  testID?: string;
}

export const CopyButton: FunctionComponent<CopyButtonProps> = ({
  text,
  testID = COPY_MESSAGE_BUTTON,
}) => {
  const [copied, setCopied] = useState(false);
  const colors = useThemeColors();

  const copyToClipboard = () => {
    Clipboard.setString(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button
      testID={testID}
      mode='text'
      compact={true}
      textColor={colors.textPrimary}
      onPress={copyToClipboard}
    >
      {copied ? COPIED_MESSAGE : COPY_MESSAGE}
    </Button>
  );
};
