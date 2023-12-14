import React from 'react';
import { StyleSheet } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import Wardrobe from './screens/Wardrobe';
import Clothes from './screens/Clothes';
import Outfit from './screens/Outfit';

const Tab = createMaterialTopTabNavigator();

function Home() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Гардероб" component={Wardrobe} />
      <Tab.Screen name="Одежда" component={Clothes} />
      <Tab.Screen name="Образы" component={Outfit} />      
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({});

export default Home;
