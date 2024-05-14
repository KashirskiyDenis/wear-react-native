import { useContext, useEffect, useState } from 'react';
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
  const { clothes } = useContext(DatabaseContext);
  const { mapImageClothes } = useContext(VariableContext);

  let [list, setList] = useState();

  useEffect(() => {
    createListClothes();
  }, [clothes]);

  let createListClothes = async () => {
    let array = [];
    for (let i = 0; i < clothes.length; i++) {
      array[i] = {
        id: clothes[i].id,
        path: clothes[i].pathToFile,
        uri: mapImageClothes.get(clothes[i].id).uri,
        type: clothes[i].type,
        category: clothes[i].category,
        season: clothes[i].season,
        color: clothes[i].color,
      };
    }
    setList(array);
  };

  return (
    <View style={styles.container}>
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
                  style={styles.itemImage}
                  source={{ uri: 'data:image/png;base64,' + item.uri }}
                />
              </View>
              <View>
                <Text style={styles.thingTitle}>{item.category}</Text>
                <Text style={styles.thingText}>{item.type}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.addButton}
        onPress={() => navigation.navigate('EditClothesScreen')}>
        <AddButton />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  item: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',    
    padding: 10,
  },
  itemImage: {
    width: 50,
    height: 50,
    resizeMode: 'cover',
    marginRight: 15,
    borderRadius: 50,
  },
  thingTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  thingText: {
    color: '#8f8e8f',
  },
  addButton: {
    position: 'absolute',
    right: 15,
    bottom: 15,
  },
});

export default ClothesScreen;
