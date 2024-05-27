import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabsNavigator from './TabsNavigator';
import EditPhotoScreen from './screens/ClothesEditPhoto';
import EditClothesScreen from './screens/Clothes';
import EditOutfitScreen from './screens/Outfit';

const Stack = createNativeStackNavigator();

function StacksNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        // headerStyle: { backgroundColor: '#007aff' },
        headerBackTitleVisible: false,
        orientation: 'portrait',
      }}>
      <Stack.Screen
        name="Home"
        component={TabsNavigator}
        options={{
          headerTitle: 'Гардероб',
        }}
      />
      <Stack.Screen
        name="EditPhotoScreen"
        component={EditPhotoScreen}
        options={{
          headerTitle: 'Редактировать фото',
        }}
      />
      <Stack.Screen
        name="EditClothesScreen"
        component={EditClothesScreen}
        options={{
          headerTitle: 'Вещь',
        }}
      />
      <Stack.Screen
        name="EditOutfitScreen"
        component={EditOutfitScreen}
        options={{
          headerTitle: 'Добавить Образ',
        }}
      />
    </Stack.Navigator>
  );
}

export default StacksNavigator;
