import * as React from 'react';
import { Text, View } from 'react-native';

function SettingsScreen() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#ffffff',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Text>Settings!</Text>
    </View>
  );
}

export default SettingsScreen;
