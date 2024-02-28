import { Text, View, TouchableOpacity } from 'react-native';
import { DatabaseContext } from '../../DatabaseContext';
import AddButton from '../AddButton';

function OutfitsScreen({ navigation }) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#ffffff',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Text>Outfit!</Text>
      <TouchableOpacity
        activeOpacity={0.8}
        style={{
          position: 'absolute',
          right: 15,
          bottom: 15,
        }}
        onPress={() => navigation.navigate('EditOutfitScreen')}>
        <AddButton />
      </TouchableOpacity>
    </View>
  );
}

export default OutfitsScreen;
