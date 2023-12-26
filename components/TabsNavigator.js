import React from 'react';
import { Text, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './Home';
import EditThingScreen from './screens/EditThing';
import ThingScreen from './screens/Thing';
import EditClothesScreen from './screens/EditClothes';
import EditOutfitScreen from './screens/EditOutfit';

const Stack = createNativeStackNavigator();

function TabsNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="ThingScreen"
      screenOptions={{
        tabBarScrollEnabled: true,
        tabBarLabelStyle: { fontSize: 16, fontWeight: 600 },
        tabBarItemStyle: { width: 120 },
        tabBarStyle: { backgroundColor: 'powderblue' },
      }}>
      <Stack.Screen
        name="Home"
        component={Home}
        options={{ title: 'WARDROBE' }}
      />
      <Stack.Screen
        name="EditThingScreen"
        component={EditThingScreen}
        options={{ title: 'Добавить Вещь' }}
      />
      <Stack.Screen
        name="ThingScreen"
        component={ThingScreen}
        options={{ title: 'Вещь' }}
      />      
      <Stack.Screen
        name="EditClothesScreen"
        component={EditClothesScreen}
        options={{ title: 'Добавить Вещь2' }}
      />      
      <Stack.Screen
        name="NewOutfitScreen"
        component={EditOutfitScreen}
        options={{ title: 'Добавить Образ' }}
      />
    </Stack.Navigator>
  );
}

export default TabsNavigator;
