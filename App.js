import { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as FileSystem from 'expo-file-system';

import StacksNavigator from './components/StacksNavigator';
import { DatabaseProvider } from './DatabaseContext';
import { VariableProvider } from './VariableContext';

function App() {
  const folders = ['clothes', 'outfits'];

  let createFolderIfNotExist = async () => {
    for (let i = 0; i < folders.length; i++) {
      let folderInfo = await FileSystem.getInfoAsync(
        `${FileSystem.documentDirectory}${folders[i]}`
      );
      if (!folderInfo.exists) {
        await FileSystem.makeDirectoryAsync(
          `${FileSystem.documentDirectory}${folders[i]}`,
          { intermediates: true }
        );
      }
    }
  };

  useEffect(() => {
    createFolderIfNotExist();
  }, []);

  return (
    <DatabaseProvider>
      <VariableProvider>
        <SafeAreaProvider>
          <NavigationContainer>
            <StacksNavigator />
          </NavigationContainer>
        </SafeAreaProvider>
      </VariableProvider>
    </DatabaseProvider>
  );
}

export default App;
