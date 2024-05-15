import { useContext, useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Button,
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { captureRef } from 'react-native-view-shot';
import * as FileSystem from 'expo-file-system';

import CustomSVG from '../CustomSVG';
import PopupPicker from '../PopupPicker';
import PopupImagePicker from '../PopupImagePicker';

import { DatabaseContext } from '../../DatabaseContext';
import { VariableContext } from '../../VariableContext';

function Outfit({ navigation, route }) {
  const {
    clothes,
    createOutift,
    readClothesInOutfit,
    createClothesInOutfit,
    updateOutfit,
    deleteClothesInOutfit,
    deleteOutfit,
  } = useContext(DatabaseContext);
  const { mapImageClothes, mapImageOutfitsPOST } = useContext(VariableContext);
  const seasonList = [
    { label: 'Зимняя', value: 'Зимняя' },
    { label: 'Весенне-осенняя', value: 'Весенне-осенняя' },
    { label: 'Летняя', value: 'Летняя' },
    { label: 'Всесезонная', value: 'Всесезонная' },
  ];
  const WIDTH = Dimensions.get('window').width;

  let imageRef = useRef();
  let [clothesImageList, setClothesImageList] = useState([]);

  let [season, setSeason] = useState(
    route.params?.season ? route.params.season : ''
  );
  let [event, setEvent] = useState(
    route.params?.event ? route.params.event : ''
  );

  let [image, setImage] = useState(undefined);
  let [figures, setFigures] = useState([]);
  let [hideTools, setHideTools] = useState(false);

  let fadeAnim = useRef(new Animated.Value(0)).current;
  let [snackbarText, setSnackbarText] = useState('');
  let [snackbarStatus, setSnackbarStatus] = useState('');
  let [snackbarVisible, setSnackbarVisible] = useState('none');

  useEffect(() => {
    createClothesImageList();

    if (route.params?.id) {
      readClothesInOutfit(route.params.id).then((resolve) => {
        let array = [];
        for (let i = 0; i < resolve.length; i++) {
          array[i] = {
            id: resolve[i].id,
            idClothes: resolve[i].idClothes,
            x: resolve[i].x,
            y: resolve[i].y,
            width: resolve[i].width,
            height: resolve[i].height,
            base64: mapImageClothes.get(resolve[i].idClothes).uri,
            transform: resolve[i].transform,
          };
        }
        setFigures(array);
      });
    } else {
      setFigures([]);
    }
  }, []);

  useEffect(() => {
    addClothesToOutfit(image);
  }, [image]);

  let addClothesToOutfit = () => {
    if (image) {
      let newFigure = { type: 'image' };
      newFigure.id = +new Date();
      newFigure.idClothes = image.key;
      newFigure.x = WIDTH * 0.2 / 2;
      newFigure.y = WIDTH * 0.2 / 2;
      newFigure.width = image.width * 0.8;
      newFigure.height = image.height * 0.8;
      newFigure.base64 = image.value;
      // newFigure.filter = '';
      // newFigure.transform = 'rotate(15, 125, 125)';
      setFigures([...figures, newFigure]);
      setImage(null);
    }
  };

  let getImage = async (pathToFile) => {
    let data = null;
    try {
      data = await FileSystem.readAsStringAsync(pathToFile, {
        encoding: FileSystem.EncodingType.Base64,
      });
    } catch (error) {
      console.error(
        'Component "Outfit". Error when loading file image.',
        error.message
      );
      showSnackbar('Ошибка загрузки изображения', 'error');
    }
    return data;
  };

  let saveOutfitImage = async () => {
    try {
      let localUri = await captureRef(imageRef, {
        height: WIDTH,
        quality: 0.75,
      });

      if (localUri) {
        let base64 = await getImage(localUri);
        let fileName = `${+new Date()}.png`;
        let path = `${FileSystem.documentDirectory}outfits/${fileName}`;

        await FileSystem.writeAsStringAsync(path, base64, {
          encoding: FileSystem.EncodingType.Base64,
        });

        return { path: path, base64: base64 };
      }
    } catch (error) {
      console.error(
        'Component "Outfit". Error when saving outfit image.',
        error.message
      );
    }
  };

  let createOutiftInDB = (image) => {
    createOutift(image.path, season, event)
      .then((idOutfit) => {
        navigation.setParams({
          id: idOutfit,
        });
        mapImageOutfitsPOST(idOutfit, image.base64);
        let requests = figures.map((figure) =>
          createClothesInOutfit(
            idOutfit,
            figure?.idClothes ? figure.idClothes : +new Date(),
            figure.x,
            figure.y,
            figure.width,
            figure.height,
            figure?.transform ? figure.transform : ''
          )
        );

        return Promise.all(requests);
      })
      .then(() => {
        showSnackbar('Изменения сохранены.', 'success');
      })
      .catch(() => {
        showSnackbar('Ошибка сохранения.', 'error');
        return;
      });
  };

  let updateOutfitInDB = (image) => {
    deleteClothesInOutfit(route.params.id)
      .then((idOutfit) => {
        let requests = figures.map((figure) =>
          createClothesInOutfit(
            idOutfit,
            figure?.idClothes ? figure.idClothes : +new Date(),
            figure.x,
            figure.y,
            figure.width,
            figure.height,
            figure?.transform ? figure.transform : ''
          )
        );

        return Promise.all(requests);
      })
      .then(async () => {
        await FileSystem.deleteAsync(route.params.path);

        updateOutfit(route.params.id, image.path, season, event).then(() => {
          mapImageOutfitsPOST(route.params.id, image.base64);
          navigation.setParams({
            path: image.path,
          });
          showSnackbar('Изменения сохранены.', 'success');
        });
      })
      .catch(() => {
        showSnackbar('Не удалость обновить данные.', 'error');
        return;
      });
  };

  let saveOutfitButton = async () => {
    if (season == '' || event == '') {
      showSnackbar('Не сохранено. Заполните все поля.', 'error');
      return;
    }
    if (figures.length == 0) {
      showSnackbar('Не сохранено. В образе нет одежды.', 'error');
      return;
    }

    let image = await saveOutfitImage();
    if (!image) {
      showSnackbar('Не удалось сохранить картинку образа.', 'error');
      return;
    }

    if (route.params?.id) {
      updateOutfitInDB(image);
    } else {
      createOutiftInDB(image);
    }
  };

  let createClothesImageList = async () => {
    if (clothes.length > 0) {
      let array = [];
      for (let i = 0; i < clothes.length; i++) {
        let item = {
          key: clothes[i].id,
          value: mapImageClothes.get(clothes[i].id).uri,
          width: mapImageClothes.get(clothes[i].id).width,
          height: mapImageClothes.get(clothes[i].id).height,
        };
        array[i] = item;
      }
      setClothesImageList(array);
    }
  };

  let removeOutfit = () => {
    deleteClothesInOutfit(route.params.id)
      .then(() => {
        deleteOutfit(route.params.id).then(() => {
          navigation.navigate('Home');
        });
      })
      .catch((error) => {
        console.error(
          'Component "Outfit". Error when deleting.',
          error.message
        );
        showSnackbar('Карточка образа не была удалена.', 'error');
      });
  };

  let removeOutfitButton = () => {
    Alert.alert(
      'Удалить образ',
      'Вы действительно хотите удалить данный образ?',
      [
        {
          text: 'Нет',
          style: 'cancel',
          isPreferred: true,
        },
        {
          text: 'Да',
          onPress: removeOutfit,
          style: 'destructive',
        },
      ]
    );
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

  return (
    <View style={styles.container}>
      <PopupImagePicker
        label="Выберите изображение"
        uriList={clothesImageList}
        onSelect={setImage}
      />
      <View ref={imageRef} collapsable={false} style={styles.svgContainer}>
        <CustomSVG data={figures} visibleTools={hideTools} />
      </View>
      <View style={{ padding: 5 }}>
        <PopupPicker
          label="Сезон образа"
          data={seasonList}
          select={{ label: season, value: season }}
          onSelect={setSeason}
          fontSize={20}
        />
        <TextInput
          style={styles.thingText}
          placeholder="Событие"
          placeholderTextColor="#8e8e93"
          onChangeText={(text) => setEvent(text, saveOutfitButton)}
          defaultValue={event}
        />
      </View>
      <View style={styles.saveView}>
        <View style={styles.androidButton}>
          <Button
            title="Удалить"
            onPress={() => {
              removeOutfitButton();
            }}
            color="#ff3b30"
            disabled={route.params?.id ? false : true}
          />
        </View>
        <View style={styles.androidButton}>
          <Button
            title="Сохранить"
            onPress={() => {
              new Promise((resolve, reject) => {
                setHideTools(true);
                resolve();
              })
                .then(() => {
                  saveOutfitButton();
                  return;
                })
                .then(() => {
                  setHideTools(false);
                });
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
  thingText: {
    fontSize: 20,
    padding: 5,
    borderLeftWidth: 1,
    borderLeftColor: '#007aff',
  },
  svgContainer: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderColor: '#e5e5ea',
  },
  saveView: {
    flex: 1,
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

export default Outfit;
