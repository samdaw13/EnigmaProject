import React, { FunctionComponent, useState } from 'react';
import { View } from 'react-native';
import { Button, Chip, Portal } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';

import { ADD_CABLE, ADD_CABLE_MODAL_BUTTON } from '../../../../../constants';
import { RootState } from '../../../../../store/store';
import { plugboardChipText } from '../../../../../utils';
import { AddCableModal } from './addCableModal';
import { rotorStyles } from '../../../../../styles';
import { removeCable } from '../../../../../features/plugboard';

export const Plugboard: FunctionComponent = () => {
  const plugboard = useSelector((state: RootState) => state.plugboard);
  const [addCableModalOpen, setAddCableModalOpen] = useState<boolean>(false);
  const dispatch = useDispatch();
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
      <View style={rotorStyles.chip}>
        {Object.keys(plugboard).map((cable, index) => (
            <Chip 
              key={`${cable}${index}`}
              testID={`${cable}${plugboard[cable]}`}
              mode='outlined'
              onClose={() => dispatch(removeCable({inputLetter: cable, outputLetter: plugboard[cable]}))}
              closeIcon={'close-circle'}
              style={{margin: 4}}
            >
              {plugboardChipText(cable, plugboard[cable])}
            </Chip>
          )
        )}
      </View>
    </View>
  );
};
