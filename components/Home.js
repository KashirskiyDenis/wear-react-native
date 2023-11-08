import React from 'react';
import { StyleSheet } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import WardrobeScreen from './screens/WardrobeScreen';
import ClothesScreen from './screens/ClothesScreen';
import OutfitScreen from './screens/OutfitScreen';

const Tab = createMaterialTopTabNavigator();

function Home() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Wardrobe" component={WardrobeScreen} />
      <Tab.Screen name="Clothes" component={ClothesScreen} />
      <Tab.Screen name="Outfits" component={OutfitScreen} />      
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({});

export default Home;
