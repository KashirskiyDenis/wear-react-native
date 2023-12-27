import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  Button,
  Dimensions,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { WebView } from 'react-native-webview';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';

import { DatabaseContext } from '../../DatabaseContext';
import htmlContent from '../../assets/webview/html/index';
import cssContent from '../../assets/webview/css/style';
import jsContent from '../../assets/webview/js/script';

let HTML;

function EditClothes({ navigation, route }) {
  const { createClothes, updateClothes } = useContext(DatabaseContext);
  let webViewRef = useRef(null);

  let saveImageFromBase64 = async (base64Data, folderName, fileName) => {
    try {
      const folderInfo = await FileSystem.getInfoAsync(
        `${FileSystem.documentDirectory}${folderName}`
      );
      if (!folderInfo.exists) {
        await FileSystem.makeDirectoryAsync(
          `${FileSystem.documentDirectory}${folderName}`,
          { intermediates: true }
        );
      }

      const filePath = route.params?.thingInfo.pathToFile
        ? route.params.thingInfo.pathToFile
        : `${FileSystem.documentDirectory}${folderName}/${fileName}`;

      await FileSystem.writeAsStringAsync(filePath, base64Data, {
        encoding: FileSystem.EncodingType.Base64,
      });

      return filePath;
    } catch (error) {
      console.error('Error saving image:', error.message);
    }
  };

  let init = () => {
    let newJS = `${jsContent}`;
    if (route.params) {
      //console.log(route.params);
      /*
      newJS = newJS.replace(
        'let base64 = null;',
        `let base64 = '${route.params.source}';`
      );
      */
    }
    HTML = htmlContent
      .replace('<style></style>', cssContent)
      .replace('<script></script>', newJS);
  };

  init();

  let onMessage = (event) => {
    const folderName = 'clothes';
    const fileName =
      new Date()
        .toISOString()
        .split('.')[0]
        .replaceAll(':', '-')
        .replace('T', '_') + '.png';
    if (route.params) {
      let thing = route.params.thingInfo;
      updateClothes(
        thing.id,
        thing.title,
        thing.pathToFile,
        thing.category,
        thing.season,
        thing.color
      );
    } else {
      let thing = {
        title: 'Title 1',
        category: 'Category 1',
        season: 'Season 1',
        color: 'Color 1',
      };
      saveNewThing(event.nativeEvent.data, folderName, fileName, thing);
    }
  };

  let postMessage = () => {
    webView.current.postMessage('post message');
  };

  let pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.2,
      base64: true, 
    });

    if (!result.canceled) {
      webViewRef.current.postMessage('data:image/png;base64,' + result.assets[0].base64);
    }
  };

  return (
    <View style={styles.container}>
    <Button title="Выберите изображение" onPress={pickImage} />
      <WebView
        ref={webViewRef}
        source={{ html: HTML }}
        scrollEnabled={false}
        javaScriptEnabled={true}
        onMessage={(event) => onMessage(event)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default EditClothes;
