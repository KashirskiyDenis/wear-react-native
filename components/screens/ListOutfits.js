import { useContext, useEffect, useState, } from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import * as FileSystem from 'expo-file-system';
import { DatabaseContext } from '../../DatabaseContext';
import AddButton from '../AddButton';

function OutfitsScreen({ navigation }) {
  const { outfits } = useContext(DatabaseContext);
  let [list, setList] = useState();

  useEffect(() => {
    createListOutfits();
  }, [outfits]);

  let getImage = async (pathToFile) => {
    let data = null;
    try {
      data = await FileSystem.readAsStringAsync(pathToFile, {
        encoding: FileSystem.EncodingType.Base64,
      });
    } catch (error) {
      console.log('Error to load file: ' + error.message);
    }
    return data;
  };

  let createListOutfits = async () => {
    if (outfits.length > 0) {
      let array = [];
      for (let i = 0; i < outfits.length; i++) {
        array[i] = {
          id: outfits[i].id,
          path: outfits[i].pathToFile,
          uri: await getImage(outfits[i].pathToFile),
          season: outfits[i].season,
          event: outfits[i].event,
        };
      }
      setList(array);
    }
  };
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#ffffff',
      }}>
      <FlatList
        data={list}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() =>
              navigation.navigate('EditClothesScreen', { ...item })
            }>
            <View style={styles.item}>
              <View>
                <Image
                  style={styles.thingImage}
                  source={{ uri: 'data:image/png;base64,' + item.uri }}
                />
              </View>
              <View>
                <Text style={styles.thingTitle}>{item.event}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity
        activeOpacity={0.8}
        style={{
          position: 'absolute',
          right: 15,
          bottom: 15,
        }}
        onPress={() => navigation.navigate('EditOutfitsScreen')}>
        <AddButton />
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  item: {
    backgroundColor: '#f9c2ff',
    paddingHorizontal: 15,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  thingImage: {
    width: 75,
    height: 75,
    resizeMode: 'cover',
    marginRight: 15,
    borderRadius: 75,
  },
  thingTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
});

export default OutfitsScreen;
