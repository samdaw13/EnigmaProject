import { FunctionComponent } from 'react';

import { View, Text } from 'react-native';
import { Rotors } from './rotors';

export const Machine: FunctionComponent = () => {
    return (
        <View>
            <Rotors />
            <Text>Enigma machine</Text>
        </View>
    );
};
