import React, { FunctionComponent, useState } from 'react';

import { View } from 'react-native';
import { Button, Chip, Portal } from 'react-native-paper';
import { AddCableModal } from './addCableModal';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store/store';

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
      <Button onPress={() => setAddCableModalOpen(true)}>
        Add cable to plugboard
      </Button>
      {Object.keys(plugboard).map((cable, index) => {
        return (
          <Chip
            key={`${cable}${index}`}
          >{`${cable} -> ${plugboard[cable]}`}</Chip>
        );
      })}
    </View>
  );
};
