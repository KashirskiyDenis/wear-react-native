import React from 'react';
import {
  Button,
  Dimensions,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AddButton from '../AddButton';

const Stack = createNativeStackNavigator();

function AddClothesScreen({ navigation }) {
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Text>Add new clothes Screen</Text>
      
    </View>
  );
}

const styles = StyleSheet.create({});

export default AddClothesScreen;
