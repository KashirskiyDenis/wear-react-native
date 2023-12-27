import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  Button,
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
  /*
  let [title, setTitle] = useState(route.params.thingInfo.title);
  let [category, setCategory] = useState(route.params.thingInfo.category);
  let [season, setSeason] = useState(route.params.thingInfo.season);
  let [color, setColor] = useState(route.params.thingInfo.color);  
*/
  let [title, setTitle] = useState('Название вещи');
  let [category, setCategory] = useState('Платье');
  let [season, setSeason] = useState('Лето');
  let [color, setColor] = useState('Синий');

  let saveNewThing = async (data, folderName, fileName, thing) => {
    try {
      const savedPath = await saveImageFromBase64(data, folderName, fileName);
      createClothes(savedPath, title, category, season, color);
    } catch (error) {
      console.error('Error saving image:', error.message);
    }
  };

  // <Button title="Изменить фото" onPress={() => navigation.navigate('EditThingScreen', route.params.thingInfo.uri)} />
  return (
    <View style={styles.container}>
      <View style={{ alignItems: 'center' }}>
        <Image
          style={styles.thingImage}
          source={require('../../assets/icon.jpg')}
          // source={{ uri: route.params.thingInfo.uri }}
        />
        <Button
          title="Изменить фото"
          onPress={() => navigation.navigate('EditPhotoScreen', { source : require('../../assets/icon.jpg')} )}
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
      <View style={styles.saveView}>
        <Button title="Сохранить" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 5,
  },
  thingImage: {
    width: 250,
    height: 250,
    resizeMode: 'cover',
    borderRadius: 250,
    borderWidth: 1,
    borderColor: '#8f8e8f',
    marginVertical: 15,
  },
  thingTitle: {
    fontSize: 24,
    fontWeight: '600',
    padding: 5,
    marginVertical: 5,
    borderLeftWidth: 1,
  },
  thingText: {
    fontSize: 16,
    padding: 5,
    marginVertical: 5,
    borderLeftWidth: 1,
    borderLeftColor: '#',
  },
  saveView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 10,
  },
});

export default EditClothes;
