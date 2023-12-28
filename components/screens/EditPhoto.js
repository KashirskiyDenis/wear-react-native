import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  Animated,
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
import { CommonActions } from '@react-navigation/native';
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
  let fadeAnim = useRef(new Animated.Value(0)).current;
  let [snackbarText, setSnackbarText] = useState('Изменения сохранены');
  let [snackbarStatus, setSnackbarStatus] = useState('');
  let saveImage = null;
  let dataSave = false;

  let saveImageFromBase64 = async (base64Data, path, folderName, fileName) => {
    try {
      if (!path) {
        let folderInfo = await FileSystem.getInfoAsync(
          `${FileSystem.documentDirectory}${folderName}`
        );
        if (!folderInfo.exists) {
          await FileSystem.makeDirectoryAsync(
            `${FileSystem.documentDirectory}${folderName}`,
            { intermediates: true }
          );
        }

        path = `${FileSystem.documentDirectory}${folderName}/${fileName}`;
      }

      await FileSystem.writeAsStringAsync(path, base64Data, {
        encoding: FileSystem.EncodingType.Base64,
      });

      setSnackbarText('Изменения сохранены');
      setSnackbarStatus('seccess');
      fadeIn();
      dataSave = true;

      return { path: path, data: base64Data };
    } catch (error) {
      setSnackbarText('Ошибка сохранения');
      setSnackbarStatus('error');
      fadeIn();
      console.error('Error saving image:', error.message);
    }
  };

  let init = () => {
    let newJS = `${jsContent}`;
    if (route.params) {
      newJS = newJS.replace(
        'let base64 = null;',
        `let base64 = '${route.params.source}';`
      );
    }
    HTML = htmlContent
      .replace('<style></style>', cssContent)
      .replace('<script></script>', newJS);
  };

  init();

  let onMessage = (event) => {
    console.log('Save');
    if (route.params?.pathToFile) {
      saveImage = saveImageFromBase64(
        event.nativeEvent.data,
        route.params.pathToFile
      );
    } else {
      let folderName = 'clothes';
      let fileName =
        new Date()
          .toISOString()
          .split('.')[0]
          .replaceAll(':', '-')
          .replace('T', '_') + '.png';
      saveImage = saveImageFromBase64(
        event.nativeEvent.data,
        null,
        folderName,
        fileName
      );
    }
  };

  let fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 0.7,
      duration: 0,
      useNativeDriver: true,
    }).start(() => {
      fadeOut();
    });
  };

  let fadeOut = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 2000,
      useNativeDriver: true,
    }).start();
  };

  let pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.2,
      base64: true,
    });

    if (!result.canceled) {
      webViewRef.current.postMessage(
        'data:image/png;base64,' + result.assets[0].base64
      );
    }
  };

  navigation.addListener('blur', () => {
    if (dataSave) {
      console.log(saveImage);
      navigation.navigate({
        name: 'ThingScreen',
        params: { data: saveImage.data, path: saveImage.path },
        merge: true,
      });
    }
  });

  return (
    <View style={styles.container}>
      <Button title="Выберите изображение" onPress={pickImage} />
      <WebView
        ref={webViewRef}
        source={{ html: HTML }}
        scrollEnabled={false}
        javaScriptEnabled={true}
        onMessage={(event) => onMessage(event)}
        style={styles.webView}
      />
      <Animated.View
        style={[
          styles.snackbar,
          snackbarStatus == 'error'
            ? styles.snackbarError
            : styles.snackbarSuccess,
          { opacity: fadeAnim },
        ]}>
        <Text style={styles.snackbarText}>{snackbarText}</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  webView: {},
  snackbar: {
    position: 'absolute',
    opacity: 0.7,
    bottom: 0,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: 15,
    paddingBottom: 25,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  snackbarText: {
    fontSize: 18,
    color: '#ffffff',
  },
  snackbarError: {
    backgroundColor: '#f44336',
  },
  snackbarSuccess: {
    backgroundColor: '#29BB42',
  },
});

export default EditClothes;
