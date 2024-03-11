import { useContext, useEffect, useState, } from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AddButton from '../AddButton';
import { DatabaseContext } from '../../DatabaseContext';
import { VariableContext } from '../../VariableContext';

function ClothesScreen({ navigation }) {
  const { clothes, } = useContext(DatabaseContext);
  const { mapImageClothes, } = useContext(VariableContext);

  let [list, setList] = useState();

  useEffect(() => {
    createListClothes();
  }, [clothes]);

  let createListClothes = async () => {
    if (clothes.length > 0) {
      let array = [];
      for (let i = 0; i < clothes.length; i++) {
        array[i] = {
          id: clothes[i].id,
          path: clothes[i].pathToFile,
          uri: mapImageClothes.get(clothes[i].id),
          title: clothes[i].title,
          category: clothes[i].category,
          season: clothes[i].season,
          color: clothes[i].color,
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
                <Image style={styles.thingImage} source={{ uri: 'data:image/png;base64,' + item.uri }} />
              </View>
              <View>
                <Text style={styles.thingTitle}>{item.title}</Text>
                <Text style={styles.thingText}>{item.category}</Text>
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
        onPress={() => navigation.navigate('EditClothesScreen')}>
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
  thingText: {
    fontSize: 16,
    color: '#8f8e8f',
  },
});

export default ClothesScreen;
