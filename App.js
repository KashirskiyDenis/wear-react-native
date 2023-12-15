import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import TabsNavigator from './components/TabsNavigator';
import { AppProvider } from './AppContext';

function App() {
  return (
    <AppProvider>
      <SafeAreaProvider>
        <NavigationContainer>
          <TabsNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </AppProvider>
  );
}

export default App;
