import React, { useContext, useEffect, useState } from 'react';
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

function ClothesScreen({ navigation }) {
  const { clothes, readClothes } = useContext(DatabaseContext);
  const [list, setList] = React.useState();

  useEffect(() => {
    readClothes();
  }, []);

  useEffect(() => {
    createListClothes();
  }, [clothes]);

  let getImage = async (pathToFile) => {
    let data = null;
    try {
      data = await FileSystem.readAsStringAsync(pathToFile, {
        encoding: FileSystem.EncodingType.Base64,
      });
    } catch (error) {
      console.log('Error to load file: ' + error.message);
    }
    return 'data:image/png;base64,' + data;
  };

  let createListClothes = async () => {
    if (clothes.length > 0) {
      let array = [];
      for (let i = 0; i < clothes.length; i++) {
        array[i] = {
          id: clothes[i].id,
          pathToFile: clothes[i].pathToFile,
          uri: await getImage(clothes[i].pathToFile),
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
              navigation.navigate('ThingScreen', { thingInfo: item })
            }>
            <View style={styles.item}>
              <View>
                <Image style={styles.thingImage} source={{ uri: item.uri }} />
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
        onPress={() => navigation.navigate('EditThingScreen')}>
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
    borderRadius: 75
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
