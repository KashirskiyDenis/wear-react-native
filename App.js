import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
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

const styles = StyleSheet.create({});

export default App;
