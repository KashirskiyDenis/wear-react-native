import React, { useContext, useEffect, useState } from 'react';
import { FlatList, Image, StyleSheet, Text, View } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { DatabaseContext } from '../../DatabaseContext';

function ClothesScreen() {
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
          uri: await getImage(clothes[i].pathToFile),
          title: clothes[i].title,
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
          <View style={styles.item}>
            <View>
              <Image style={styles.thing} source={{ uri: item.uri }} />
            </View>
            <View>
              <Text style={styles.thingText}>{item.title}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#f9c2ff',
    padding: 5,
    marginVertical: 8,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  thing: {
    width: 150,
    height: 150,
    resizeMode: 'cover',
    marginRight: 5
  },
  thingText: {
    fontSize: 24
  }
});

export default ClothesScreen;
