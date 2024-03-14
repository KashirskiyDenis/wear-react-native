import { useRef, useState } from 'react';
import { Animated, Button, StyleSheet, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';

import htmlContent from '../../assets/webview/html/index';
import cssContent from '../../assets/webview/css/style';
import jsContent from '../../assets/webview/js/script';

let HTML;

function EditPhoto({ navigation, route }) {
  let webViewRef = useRef(null);

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

  let init = () => {
    let newJS = `${jsContent}`;
    if (route.params) {
      newJS = newJS.replace(
        'let base64 = null;',
        `let base64 = 'data:image/png;base64,${route.params.uri}';`
      );
    }
    HTML = htmlContent
      .replace('<style></style>', cssContent)
      .replace('<script></script>', newJS);
  };

  init();

  let onMessage = async (event) => {
    let tmp;
    let data = event.nativeEvent.data;
    try {
      if (route.params?.path) {
        tmp = await saveImageFromBase64(data, route.params.path);
      } else {
        let folderName = 'clothes';
        let fileName = +new Date() + '.png';
        tmp = await saveImageFromBase64(data, null, folderName, fileName);
      }

      setSnackbarVisible('block');
      setSnackbarText('Изменения сохранены');
      setSnackbarStatus('success');

      fadeIn();
      setPathFile(tmp);
      setBase64(data);
    } catch (error) {
      console.error(
        'Component "ClothesEditPhoto". Error when saving image.',
        error.message
      );
      setSnackbarVisible('block');
      setSnackbarText('Ошибка сохранения');
      setSnackbarStatus('error');
      fadeIn();
    }
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
      quality: 0.5,
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
      />
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
