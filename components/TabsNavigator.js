import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import Wardrobe from './screens/Wardrobe';
import ListClothes from './screens/ClothesList';
import ListOutfits from './screens/OutfitsList';

const Tab = createMaterialTopTabNavigator();

function TabsNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Обзор" component={Wardrobe} />
      <Tab.Screen name="Одежда" component={ListClothes} />
      <Tab.Screen name="Образы" component={ListOutfits} />      
    </Tab.Navigator>
  );
}

export default TabsNavigator;