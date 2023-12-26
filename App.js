import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import TabsNavigator from './components/TabsNavigator';
import { DatabaseProvider } from './DatabaseContext';

function App() {
  return (
    <DatabaseProvider>
      <SafeAreaProvider>
        <NavigationContainer>
          <TabsNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </DatabaseProvider>
  );
}

export default App;

