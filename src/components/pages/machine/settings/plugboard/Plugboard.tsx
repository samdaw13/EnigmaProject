import React, { FunctionComponent, useState } from 'react';
import { View } from 'react-native';
import { Button, Chip, Portal } from 'react-native-paper';
import { useSelector } from 'react-redux';

import { ADD_CABLE, ADD_CABLE_MODAL_BUTTON } from '../../../../../constants';
import { RootState } from '../../../../../store/store';
import { plugboardChipText } from '../../../../../utils';
import { AddCableModal } from './addCableModal';

export const Plugboard: FunctionComponent = () => {
  const plugboard = useSelector((state: RootState) => state.plugboard);
  const [addCableModalOpen, setAddCableModalOpen] = useState<boolean>(false);
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
        onPress={() => setAddCableModalOpen(true)}
      >
        {ADD_CABLE}
      </Button>
      {Object.keys(plugboard).map((cable, index) => {
        return (
          <Chip key={`${cable}${index}`} testID={`${cable}${plugboard[cable]}`}>
            {plugboardChipText(cable, plugboard[cable])}
          </Chip>
        );
      })}
    </View>
  );
};
