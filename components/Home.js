import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import Wardrobe from './screens/Wardrobe';
import ListClothes from './screens/ListClothes';
import ListOutfits from './screens/ListOutfits';

const Tab = createMaterialTopTabNavigator();

function Home() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Гардероб" component={Wardrobe} />
      <Tab.Screen name="Одежда" component={ListClothes} />
      <Tab.Screen name="Образы" component={ListOutfits} />      
    </Tab.Navigator>
  );
}

export default Home;