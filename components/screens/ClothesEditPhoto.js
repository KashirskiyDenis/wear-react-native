import { useRef, useState } from 'react';
import { Animated, Button, StyleSheet, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';

import htmlContent from '../../assets/webview/html/editPhoto';
import cssContent from '../../assets/webview/css/editPhoto';
import jsContent from '../../assets/webview/js/editPhoto';

let HTML = htmlContent.replace('<style></style>', cssContent);

function EditPhoto({ navigation, route }) {
  let webViewRef = useRef();

  let [pathFile, setPathFile] = useState('');
  let [base64, setBase64] = useState(route.params?.uri ? route.params.uri : '');

  let fadeAnim = useRef(new Animated.Value(0)).current;
  let [snackbarText, setSnackbarText] = useState('');
  let [snackbarStatus, setSnackbarStatus] = useState('');
  let [snackbarVisible, setSnackbarVisible] = useState('none');

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
    let data = event.nativeEvent.data;
    try {
      if (route.params?.path) {
        tmp = await saveImageFromBase64(data, route.params.path);
      } else {
        tmp = await saveImageFromBase64(
          data,
          null,
          'clothes',
          +new Date() + '.png'
        );
      }

      setPathFile(tmp);
      setBase64(data);
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

  let pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.75,
      base64: true,
    });

    if (!result.canceled) {
      webViewRef.current.postMessage(
        'data:image/png;base64,' + result.assets[0].base64
      );
    }
  };

  navigation.addListener('blur', () => {
    navigation.navigate({
      name: 'EditClothesScreen',
      params: { uri: base64, path: pathFile },
      merge: true,
    });
  });

  return (
    <View style={styles.container}>
      <Button title="Выберите изображение" onPress={pickImage} />
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
        <Button
          title="Ластик"
          onPress={() => {
            let js = `canvas.removeEventListener('pointerdown', tools[tool]);
              canvas.addEventListener('pointerdown', eraser);
              tool = 'bgEraser';`;
            webViewRef.current.injectJavaScript(js);
          }}
        />
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
      <View style={styles.saveView}>
        <Button
          title="Сохранить"
          onPress={() => {
            let js = `window.ReactNativeWebView.postMessage(canvas.toDataURL().split(';base64,')[1]);`;
            webViewRef.current.injectJavaScript(js);
          }}
        />
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
  snackbar: {
    position: 'absolute',
    width: 390,
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: 15,
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
