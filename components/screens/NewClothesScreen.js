import React, { useState, useEffect } from 'react';
import {
  Button,
  Dimensions,
  Image,
  ImageBackground,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const WIDTH = Dimensions.get('window').width;

function AddClothesScreen({ navigation }) {
  const [image, setImage] = useState(null);
  const [height, setHeight] = useState(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      let coef = result.assets[0].width / WIDTH;
      setHeight(parseInt(result.assets[0].height / coef));
    }
  };

  const onPress = (event) => {
    let coordX = event.nativeEvent.locationX;
    let coordY = event.nativeEvent.locationY;
  };

  return (
    <View style={{ flex: 1 }}>
      <Button title="Pick an image from camera roll" onPress={pickImage} />
      {image && (
        <TouchableWithoutFeedback
          onPress={onPress}
          style={{ width: WIDTH, height: height }}>
          <Image
            source={{ uri: image }}
            resizeMode="contain"
            style={{ width: WIDTH, height: height }}></Image>
        </TouchableWithoutFeedback>
      )}
    </View>
  );
}

const styles = StyleSheet.create({});

export default AddClothesScreen;
