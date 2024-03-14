import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './Home';
import EditPhotoScreen from './screens/ClothesEditPhoto';
import EditClothesScreen from './screens/Clothes';
import EditOutfitScreen from './screens/Outfit';

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
        options={{ title: 'Гардероб' }}
      />
      <Stack.Screen
        name="EditPhotoScreen"
        component={EditPhotoScreen}
        options={{ title: 'Редактировать фото' }}
      />
      <Stack.Screen
        name="EditClothesScreen"
        component={EditClothesScreen}
        options={{ title: 'Вещь' }}
      />      
      <Stack.Screen
        name="EditOutfitScreen"
        component={EditOutfitScreen}
        options={{ title: 'Добавить Образ' }}
      />
    </Stack.Navigator>
  );
}

export default TabsNavigator;