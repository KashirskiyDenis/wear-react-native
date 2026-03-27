import { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as FileSystem from 'expo-file-system/legacy';

import StacksNavigator from './components/StacksNavigator';
import { DatabaseProvider } from './DatabaseContext';
import { VariableProvider } from './VariableContext';

const FOLDERS = ['clothes', 'outfits'];

function App() {
  let createFolderIfNotExist = async () => {
    try {
      for (let i = 0; i < FOLDERS.length; i++) {
        let folderPath = `${FileSystem.documentDirectory}${FOLDERS[i]}`;
        let folderInfo = await FileSystem.getInfoAsync(folderPath);

        if (!folderInfo.exists) {
          await FileSystem.makeDirectoryAsync(folderPath, {
            intermediates: true,
          });
        }
      }
    } catch (error) {
      console.error('Error creating folders:', error.message);
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
