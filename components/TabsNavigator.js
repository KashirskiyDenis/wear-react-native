import React from 'react';
import { Text, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './Home';
import SettingsScreen from './screens/SettingsScreen';
import NewClothesScreen from './screens/NewClothesScreen';
import NewOutfitScreen from './screens/NewOutfitScreen';

const Stack = createNativeStackNavigator();

function TabsNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        tabBarScrollEnabled: true,
        tabBarLabelStyle: { fontSize: 16, fontWeight: 600 },
        tabBarItemStyle: { width: 120 },
        tabBarStyle: { backgroundColor: 'powderblue' },
      }} >
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="NewClothesScreen" component={NewClothesScreen} options={{ title: 'New Clothes'}}/>
      <Stack.Screen name="NewOutfitScreen" component={NewOutfitScreen} options={{ title: 'New Outfit'}}/>
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
}

export default TabsNavigator;
