import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './Home';
import EditPhotoScreen from './screens/EditPhoto';
import ThingScreen from './screens/Thing';
import EditClothesScreen from './screens/EditClothes';
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
        name="EditPhotoScreen"
        component={EditPhotoScreen}
        options={{ title: 'Редактировать фото' }}
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