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

import { DatabaseContext } from '../../DatabaseContext';
import htmlContent from '../../assets/webview/html/index';
import cssContent from '../../assets/webview/css/style';
import jsContent from '../../assets/webview/js/script';

let HTML;

function EditClothes({ navigation, route }) {
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

  const { createClothes, updateClothes } = useContext(DatabaseContext);

  let init = () => {
    let newJS = `${jsContent}`;
    if (route.params) {
      newJS = newJS.replace(
        'let base64 = null;',
        `let base64 = '${route.params.thingInfo.uri}';`
      );
    }
    HTML = htmlContent
      .replace('<style></style>', cssContent)
      .replace('<script></script>', newJS);
  };

  init();

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

  let webViewMessage = (event) => {
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

  return (
    <View style={{ flex: 1 }}>
      <WebView
        source={{ html: HTML }}
        scrollEnabled={false}
        javaScriptEnabled={true}
        onMessage={(event) => webViewMessage(event)}
      />
    </View>
  );
}

const styles = StyleSheet.create({});

export default EditClothes;
