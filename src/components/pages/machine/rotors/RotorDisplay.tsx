import { FunctionComponent, useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { Text } from "react-native-paper";
import { View } from "react-native";

export const RotorDisplay: FunctionComponent = () => {
    const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
    return (
        <View
            style={{
                overflow: 'hidden',
            }}
        >
            <ScrollView
                bounces={false}
                showsHorizontalScrollIndicator={false}
            >
                <Text>Some awesome text</Text>
            </ScrollView>
        </View>
    )
}