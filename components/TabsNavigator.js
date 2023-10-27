import * as React from 'react';
import { Text, View } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useSafeArea } from 'react-native-safe-area-context';

import HomeScreen from './HomeScreen';
import WearScreen from './WearScreen';
import OutfitScreen from './OutfitScreen';
import SettingsScreen from './SettingsScreen';

const Tab = createMaterialTopTabNavigator();

function TabsNavigator() {
  const insets = useSafeArea();

  return (
    <Tab.Navigator
      style={{ marginTop: insets.top }}
      screenOptions={{
        tabBarScrollEnabled: true,
        tabBarLabelStyle: { fontSize: 12 },
        tabBarItemStyle: { width: 100 },
        tabBarStyle: { backgroundColor: 'powderblue' },
      }}>
      <Tab.Screen
        name="Wardrobe"
        component={HomeScreen}
        options={{
          headerStyle: {
            backgroundColor: '#f4511e',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: '700',
            fontSize: 24,
          },
        }}
      />
      <Tab.Screen
        name="Wear"
        component={WearScreen}
        options={{
          headerStyle: {
            backgroundColor: '#f4511e',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: '700',
            fontSize: 24,
          },
        }}
      />
      <Tab.Screen
        name="Outfits"
        component={OutfitScreen}
        options={{
          headerStyle: {
            backgroundColor: '#f4511e',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: '700',
            fontSize: 24,
          },
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          headerStyle: {
            backgroundColor: '#f4511e',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: '700',
            fontSize: 24,
          },
        }}
      />
    </Tab.Navigator>
  );
}

export default TabsNavigator;
