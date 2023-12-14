import React from 'react';
import { Text, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './Home';
import SettingsScreen from './screens/Settings';
import NewClothesScreen from './screens/NewClothes';
import NewOutfitScreen from './screens/NewOutfit';

const Stack = createNativeStackNavigator();

function TabsNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarScrollEnabled: true,
        tabBarLabelStyle: { fontSize: 16, fontWeight: 600 },
        tabBarItemStyle: { width: 120 },
        tabBarStyle: { backgroundColor: 'powderblue' },
      }}>
      <Stack.Screen name="WARDROBE" component={Home} />
      <Stack.Screen
        name="NewClothesScreen"
        component={NewClothesScreen}
        options={{ title: 'Добавить Одежду' }}
      />
      <Stack.Screen
        name="NewOutfitScreen"
        component={NewOutfitScreen}
        options={{ title: 'Добавить Образ' }}
      />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
}

export default TabsNavigator;
