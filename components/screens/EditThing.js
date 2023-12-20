import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  Button,
  Dimensions,
  Image,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import { WebView } from 'react-native-webview';
import * as FileSystem from 'expo-file-system';

import { DatabaseContext } from '../../DatabaseContext';
import htmlContent from '../../assets/webview/html/index';
import cssContent from '../../assets/webview/css/style';
import jsContent from '../../assets/webview/js/script';

let HTML = htmlContent
  .replace('<style></style>', cssContent)
  .replace('<script></script>', jsContent);

const saveImageFromBase64 = async (base64Data, folderName, fileName) => {
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

    const filePath = `${FileSystem.documentDirectory}${folderName}/${fileName}`;

    await FileSystem.writeAsStringAsync(filePath, base64Data, {
      encoding: FileSystem.EncodingType.Base64,
    });

    return filePath;
  } catch (error) {
    console.error('Error saving image:', error.message);
  }
};

function EditClothes() {
  const { createClothes } = useContext(DatabaseContext);

  let saveNewClothe = async (data, folderName, fileName) => {
    try {
      const savedPath = await saveImageFromBase64(data, folderName, fileName);
      createClothes(savedPath, 'title1', 'category1', 'season1', 'color1');
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
    saveNewClothe(event.nativeEvent.data, folderName, fileName);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <WebView
        source={{ html: HTML }}
        scrollEnabled={false}
        javaScriptEnabled={true}
        onMessage={(event) => webViewMessage(event)}
        scalesPageToFit={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({

});

export default EditClothes;
