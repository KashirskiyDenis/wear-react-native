import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Button,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { WebView } from 'react-native-webview';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';

import PopupPhotoPicker from '../PopupPhotoPicker';

import htmlContent from '../../assets/webview/html/editPhoto';
import cssContent from '../../assets/webview/css/editPhoto';
import jsContent from '../../assets/webview/js/editPhoto';

let HTML = htmlContent.replace('<style></style>', cssContent);

function EditPhoto({ navigation, route }) {
  let webViewRef = useRef();

  let [pathFile, setPathFile] = useState('');
  let [base64, setBase64] = useState(route.params?.uri ? route.params.uri : '');
  let [size, setSize] = useState();

  let fadeAnim = useRef(new Animated.Value(0)).current;
  let [snackbarText, setSnackbarText] = useState('');
  let [snackbarStatus, setSnackbarStatus] = useState('');
  let [snackbarVisible, setSnackbarVisible] = useState('none');

  let [wayPick, setWeyPick] = useState(null);
  let [status, requestPermission] = ImagePicker.useCameraPermissions();

  useEffect(() => {
    if (wayPick) {
      pickImage(wayPick);
      setWeyPick(null);
    }
  }, [wayPick]);

  let saveImageFromBase64 = async (base64Data, path, folderName, fileName) => {
    if (!path) {
      path = `${FileSystem.documentDirectory}${folderName}/${fileName}`;
    }

    await FileSystem.writeAsStringAsync(path, base64Data, {
      encoding: FileSystem.EncodingType.Base64,
    });

    return path;
  };

  let handleLoadEnd = () => {
    let newJS = `${jsContent}`;
    if (route.params) {
      newJS = newJS.replace(
        'let base64 = null;',
        `let base64 = 'data:image/png;base64,${route.params.uri}';`
      );
    }
    webViewRef.current.injectJavaScript(newJS);
  };

  let onMessage = async (event) => {
    let tmp;
    console.log('Message')
    let data = JSON.parse(event.nativeEvent.data);
    if (!data.base64) {
      showSnackbar('Ошибка сохранения.', 'error');
      return;
    }
    try {
      if (route.params?.path) {
        tmp = await saveImageFromBase64(data.base64, route.params.path);
      } else {
        tmp = await saveImageFromBase64(
          data.base64,
          null,
          'clothes',
          +new Date() + '.png'
        );
      }

      setPathFile(tmp);
      setBase64(data.base64);
      setSize({ width: data.width, height: data.height });
      showSnackbar('Изменения сохранены.', 'success');
    } catch (error) {
      console.error(
        'Component "ClothesEditPhoto". Error when saving image in file system.',
        error.message
      );
      showSnackbar('Ошибка сохранения.', 'error');
    }
  };

  let showSnackbar = (text, status) => {
    setSnackbarVisible('block');
    setSnackbarText(text);
    setSnackbarStatus(status);
    fadeIn();
  };

  let fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1.0,
      duration: 0,
      useNativeDriver: true,
    }).start(() => {
      fadeOut();
    });
  };

  let fadeOut = () => {
    Animated.timing(fadeAnim, {
      toValue: 0.85,
      duration: 3000,
      useNativeDriver: true,
    }).start(() => {
      setSnackbarVisible('none');
    });
  };

  let pickImage = async (way) => {
    let result;
    if (way == 'gallery') {
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1.0,
        base64: true,
      });
    } else if (way == 'camera') {
      requestPermission();
      result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1.0,
        base64: true,
      });
    }

    if (!result.canceled) {
      webViewRef.current.postMessage(
        'data:image/png;base64,' + result.assets[0].base64
      );
    }
  };

  navigation.addListener('blur', () => {
    navigation.navigate({
      name: 'EditClothesScreen',
      params: { uri: base64, path: pathFile, size: size },
      merge: true,
    });
  });

  return (
    <View style={styles.container}>
      {
        // <Button
        //   title="Выберите изображение"
        //   onPress={() => {
        //     pickImage('Галерея');
        //   }}
        // />
      }
      <PopupPhotoPicker label="Выберите изображение" onSelect={setWeyPick} />
      <WebView
        ref={webViewRef}
        originWhitelist={['*']}
        source={{ html: HTML }}
        scrollEnabled={false}
        javaScriptEnabled={true}
        onMessage={(event) => onMessage(event)}
        onLoadEnd={handleLoadEnd}
      />
      <View style={styles.saveView}>
        <View style={styles.androidButton}>
          <Button
            title="Ластик"
            onPress={() => {
              let js = `canvas.removeEventListener('pointerdown', tools[tool]);
              canvas.addEventListener('pointerdown', eraser);
              tool = 'bgEraser';`;
              webViewRef.current.injectJavaScript(js);
            }}
          />
        </View>
        <View style={styles.androidButton}>
          <Button
            title="Волшебный Ластик"
            onPress={() => {
              let js = `canvas.removeEventListener('pointerdown', tools[tool]);
              canvas.addEventListener('pointerdown', filling);
              tool = 'filling';`;
              webViewRef.current.injectJavaScript(js);
            }}
          />
        </View>
        <View style={styles.androidButton}>
          <Button
            title="Сохранить"
            onPress={() => {
              let js;
              if (Platform.OS != 'ios') {
                js = `document.ReactNativeWebView.postMessage(JSON.stringify({
                base64: canvas.toDataURL().split(';base64,')[1],
                width: canvas.width,
                height: canvas.height
                }));`;
              } else {
                js = `window.ReactNativeWebView.postMessage(JSON.stringify({
                base64: canvas.toDataURL().split(';base64,')[1],
                width: canvas.width,
                height: canvas.height
                }));`;
              }
              webViewRef.current.injectJavaScript(js);
            }}
          />
        </View>
      </View>
      <Animated.View
        style={[
          styles.snackbar,
          snackbarStatus == 'error'
            ? styles.snackbarError
            : styles.snackbarSuccess,
          { opacity: fadeAnim },
          { display: snackbarVisible },
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
  saveView: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 10,
  },
  androidButton: {
    marginTop: Platform.OS === 'android' ? 5 : 0,
  },
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

export default EditPhoto;
