import type { FunctionComponent } from 'react';
import React, { useMemo, useState } from 'react';
import { View } from 'react-native';
import { Button, Chip, Portal } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';

import { ADD_CABLE, ADD_CABLE_MODAL_BUTTON } from '../../../../../constants';
import { removeCable } from '../../../../../features/plugboard';
import type { RootState } from '../../../../../store/store';
import { makeRotorStyles } from '../../../../../styles';
import { useThemeColors } from '../../../../../theme/useThemeColors';
import { plugboardChipText } from '../../../../../utils';
import { AddCableModal } from './addCableModal';

export const Plugboard: FunctionComponent = () => {
  const plugboard = useSelector((state: RootState) => state.plugboard);
  const [addCableModalOpen, setAddCableModalOpen] = useState<boolean>(false);
  const dispatch = useDispatch();
  const colors = useThemeColors();
  const rotorStyles = useMemo(() => makeRotorStyles(colors), [colors]);

  return (
    <View>
      <Portal>
        <AddCableModal
          modalVisible={addCableModalOpen}
          setModalVisible={setAddCableModalOpen}
        />
      </Portal>
      <Button
        testID={ADD_CABLE_MODAL_BUTTON}
        mode='outlined'
        textColor={colors.textPrimary}
        style={{ borderColor: colors.border }}
        onPress={() => setAddCableModalOpen(true)}
      >
        {ADD_CABLE}
      </Button>
      <View style={rotorStyles.chip}>
        {Object.keys(plugboard).map((cable) => (
          <Chip
            key={cable}
            testID={`${cable}${plugboard[cable]!}`}
            mode='outlined'
            onClose={() =>
              dispatch(
                removeCable({
                  inputLetter: cable,
                  outputLetter: plugboard[cable]!,
                }),
              )
            }
            closeIcon={'close-circle'}
            style={{
              margin: 4,
              borderColor: colors.border,
              backgroundColor: colors.surface,
            }}
            textStyle={{ color: colors.textPrimary }}
          >
            {plugboardChipText(cable, plugboard[cable]!)}
          </Chip>
        ))}
      </View>
    </View>
  );
};
