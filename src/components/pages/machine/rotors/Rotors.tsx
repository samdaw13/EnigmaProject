import { FunctionComponent, createContext, useState, useEffect } from 'react';

import { View } from 'react-native';
import { Rotor } from './Rotor';
import { rotorStyles } from '../../../../styles';
export const Rotors: FunctionComponent = () => {
    return (
        <View style={rotorStyles.container}>
            <Rotor />
            <Rotor />
            <Rotor />
        </View>
    );
};
