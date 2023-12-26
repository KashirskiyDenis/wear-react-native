import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import { DatabaseContext } from '../../DatabaseContext';

function EditClothes({ navigation, route }) {
  const { createClothes, updateClothes } = useContext(DatabaseContext);

  let [title, setTitle] = useState('');
  let [category, setCategory] = useState('');
  let [season, setSeason] = useState('');
  let [color, setColor] = useState('');

  let saveNewThing = async (data, folderName, fileName, thing) => {
    try {
      const savedPath = await saveImageFromBase64(data, folderName, fileName);
      createClothes(
        savedPath,
        thing.title,
        thing.category,
        thing.season,
        thing.color
      );
    } catch (error) {
      console.error('Error saving image:', error.message);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#', padding: 10 }}>
      <View style={{ alignItems: 'center', }}>
        <Image
          style={styles.thingImage}
          source={{ uri: require('../../assets/snack-icon.png') }}
        />
      </View>
      <View>
        <TextInput
          style={styles.thingTitle}
          placeholder="Название вещи"
          onChangeText={(text) => setTitle(text)}
          defaultValue={title}
        />
        <TextInput
          style={styles.thingText}
          placeholder="Категория вещи"
          onChangeText={(text) => setCategory(text)}
          defaultValue={category}
        />
        <TextInput
          style={styles.thingText}
          placeholder="Сезон вещи"
          onChangeText={(text) => setSeason(text)}
          defaultValue={season}
        />
        <TextInput
          style={styles.thingText}
          placeholder="Категория вещи"
          onChangeText={(text) => setColor(text)}
          defaultValue={color}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  thingImage: {
    width: 250,
    height: 250,
    resizeMode: 'cover',
    borderRadius: 250,
    borderWidth: 1,
    borderColor: '#8f8e8f',
    marginBottom: 15,
  },
  thingTitle: {
    fontSize: 24,
    fontWeight: '600',
    padding: 5,
    marginVertical: 5,
  },
  thingText: {
    fontSize: 16,
    padding: 5,
    marginVertical: 5,    
  },
});

export default EditClothes;
