import React from 'react';
import { Dimensions, Text, View } from 'react-native';
import PaiChart from '../PaiChart';

const WIDTH = Dimensions.get('window').width;

function HomeScreen() {
  const [countWear, setCountWear] = React.useState(0);

  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <PaiChart
        widthAndHeight={WIDTH}
        data={[30, 60, 90, 120, 60]}
      />
      <Text>Всего вещей: {countWear}</Text>
    </View>
  );
}

export default HomeScreen;
