import React from 'react';
import { Text, View } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useSafeArea } from 'react-native-safe-area-context';

import HomeScreen from './screens/HomeScreen';
import WearScreen from './screens/WearScreen';
import OutfitScreen from './screens/OutfitScreen';
import SettingsScreen from './screens/SettingsScreen';

const Tab = createMaterialTopTabNavigator();

function TabsNavigator() {
  const insets = useSafeArea();

  return (
    <Tab.Navigator
      style={{ marginTop: insets.top }}
      screenOptions={{
        tabBarScrollEnabled: true,
        tabBarLabelStyle: { fontSize: 16, fontWeight: 600 },
        tabBarItemStyle: { width: 120 },
        tabBarStyle: { backgroundColor: 'powderblue' },
      }}>
      <Tab.Screen name="Wardrobe" component={HomeScreen} />
      <Tab.Screen name="Wear" component={WearScreen} />
      <Tab.Screen name="Outfits" component={OutfitScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

export default TabsNavigator;
