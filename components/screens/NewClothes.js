import React, { useEffect, useRef, useState } from 'react';
import {
  Button,
  Dimensions,
  Image,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { WebView } from 'react-native-webview';
import * as FileSystem from 'expo-file-system';

import htmlContent from '../../assets/webview/html/index';
import cssContent from '../../assets/webview/css/style';
import jsContent from '../../assets/webview/js/script';

let HTML = htmlContent
  .replace('<style></style>', cssContent)
  .replace('<script></script>', jsContent);

const saveImageFromBase64 = async (base64Data, folderName, fileName) => {
  try {
    // Проверяем, существует ли папка, если нет - создаем
    const folderInfo = await FileSystem.getInfoAsync(
      `${FileSystem.documentDirectory}${folderName}`
    );
    if (!folderInfo.exists) {
      await FileSystem.makeDirectoryAsync(
        `${FileSystem.documentDirectory}${folderName}`,
        { intermediates: true }
      );
    }

    // Создаем путь для сохранения изображения
    const filePath = `${FileSystem.documentDirectory}${folderName}/${fileName}`;

    // Сохраняем изображение
    await FileSystem.writeAsStringAsync(filePath, base64Data, {
      encoding: FileSystem.EncodingType.Base64,
    });

    return filePath;
  } catch (error) {
    console.error('Error saving image:', error);
    throw error;
  }
};

function AddClothes() {
  let webViewMessage = async (event) => {
    const folderName = 'YourImageFolder';
    const fileName = 'saved_image.png';
    // console.log(event.nativeEvent.data);
/*
    try {
      const savedPath = await saveImageFromBase64(
        event.nativeEvent.data,
        folderName,
        fileName
      );
      console.log('Image saved successfully:', savedPath);
    } catch (error) {
      console.error('Error saving image:', error);
    }
    */
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
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

export default AddClothes;
