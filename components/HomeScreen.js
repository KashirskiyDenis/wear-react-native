import * as React from 'react';
import { Text, View } from 'react-native';

function HomeScreen() {
  const [countWear, setCountWear] = React.useState(0);

  return (
    <View style={{ flex: 1, }}>
      <Text>Всего вещей: {countWear}</Text>
    </View>
  );
}

export default HomeScreen;
