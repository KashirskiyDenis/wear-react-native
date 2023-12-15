import React from 'react';
import { Text, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './Home';
import EditThingScreen from './screens/EditThing';
import EditOutfitScreen from './screens/EditOutfit';

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
      <Stack.Screen
        name="Home"
        component={Home}
        options={{ title: 'WARDROBE' }}
      />
      <Stack.Screen
        name="NewClothesScreen"
        component={EditThingScreen}
        options={{ title: 'Добавить Вещь' }}
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
