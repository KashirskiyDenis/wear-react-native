import { useContext, useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Button,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { captureRef } from 'react-native-view-shot';
import * as FileSystem from 'expo-file-system';

import CustomSVG from '../CustomSVG';
import PopupSelect from '../PopupSelect';
import PopupImageSelect from '../PopupImageSelect';

import { DatabaseContext } from '../../DatabaseContext';
import { VariableContext } from '../../VariableContext';
import { data } from '../../services/imageBase64';

function Outfit({ navigation, route }) {
  const {
    clothes,
    clothesInOutfit,
    createOutift,
    readClothesInOutfit,
    createClothesInOutfit,
  } = useContext(DatabaseContext);
  const { mapImageClothes, mapImageOutfitsPOST } = useContext(VariableContext);
  const seasonList = [
    { label: 'Зимняя', value: 'Зима' },
    { label: 'Весенне-осенняя', value: 'Весенне-осенняя' },
    { label: 'Летняя', value: 'Летняя' },
    { label: 'Демисезонная', value: 'Демисезонная' },
    { label: 'Внесезонная', value: 'Внесезонная' },
  ];

  let imageRef = useRef();

  let [clothesImageList, setClothesImageList] = useState(data);

  let [season, setSeason] = useState(
    route.params?.season ? route.params.season : ''
  );
  let [event, setEvent] = useState(
    route.params?.event ? route.params.event : ''
  );

  let [image, setImage] = useState(undefined);
  let [figures, setFigures] = useState([]);

  let fadeAnim = useRef(new Animated.Value(0)).current;
  let [snackbarText, setSnackbarText] = useState('');
  let [snackbarStatus, setSnackbarStatus] = useState('');
  let [snackbarVisible, setSnackbarVisible] = useState('none');

  useEffect(() => {
    createClothesImageList();
  }, [clothes]);

  useEffect(() => {
    if (route.params?.id) {
      readClothesInOutfit(route.params.id);
    }
  }, []);

  useEffect(() => {
    addClothesToOutfit(image);
  }, [image]);

  useEffect(() => {
    if (clothesInOutfit.length > 0) {
      console.log(clothesInOutfit);
    }
  }, [clothesInOutfit]);

  let addClothesToOutfit = () => {
    if (image) {
      let newFigure = { type: 'image' };
      newFigure.idClothes = image.key;
      newFigure.x = 50;
      newFigure.y = 50;
      newFigure.width = 150;
      newFigure.height = 150;
      newFigure.base64 = image.value;
      // newFigure.filter = '';
      // newFigure.transform = 'rotate(15, 125, 125)';
      setFigures([...figures, newFigure]);
    }
  };

  let saveOutfitImage = async () => {
    try {
      let localUri = await captureRef(imageRef, {
        height: 390,
        quality: 0.5,
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

  let saveOutfit = async () => {
    let image;
    try {
      if (season == '' || event == '')
        throw new Error('Not all text fields are filled in');
      if (figures.length == 0)
        throw new Error('Not a single thing has been added to the outfit');

      if (route.params?.id) {
        // updateClothes(
        //   route.params.id,
        //   title,
        //   route.params.path,
        //   category,
        //   season,
        //   color
        // );
      } else {
        image = await saveOutfitImage();
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

            Promise.all(requests).then((responses) =>
              responses.forEach((response) =>
                console.log(
                  'The picture of the clothes for the outfit has been saved'
                )
              )
            );
          })
          .catch((error) => {
            console.log(error.message);
          });
      }
      setSnackbarVisible('block');
      setSnackbarText('Изменения сохранены');
      setSnackbarStatus('seccess');
      fadeIn();
    } catch (error) {
      console.error(
        'Component "Outfit". Error when saving outfit.',
        error.message
      );

      setSnackbarVisible('block');
      setSnackbarText('Не сохранено. Заполните все поля.');
      setSnackbarStatus('error');
      fadeIn();
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
    }
    return data;
  };

  let createClothesImageList = async () => {
    if (clothes.length > 0) {
      let array = [];
      for (let i = 0; i < clothes.length; i++) {
        let item = {
          key: clothes[i].id,
          value: mapImageClothes.get(clothes[i].id),
        };
        array[i] = item;
      }
      setClothesImageList(array);
    }
  };

  let removeOutfitFromDB = () => {
    deleteOutfit(route.params.id)
      .then(() => {
        navigation.navigate('Home');
      })
      .catch((error) => {
        console.error(
          'Component "Outfit". Error when deleting.',
          error.message
        );
        setSnackbarVisible('block');
        setSnackbarText('Карточка образа не была удалена.');
        setSnackbarStatus('error');
        fadeIn();
      });
  };

  let removeOutfit = () => {
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
          onPress: removeOutfitFromDB,
          style: 'destructive',
        },
      ]
    );
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
      <PopupImageSelect
        label="Выберите изображение"
        uriList={clothesImageList}
        onSelect={setImage}
        style={{ fontSize: 20 }}
      />
      <View ref={imageRef} collapsable={false} style={styles.svgContainer}>
        <CustomSVG data={figures} />
      </View>
      <View style={{ padding: 5 }}>
        <PopupSelect
          label="Сезон вещи"
          data={seasonList}
          select={{ label: season, value: season }}
          onSelect={setSeason}
          style={{ fontSize: 20 }}
        />
        <TextInput
          style={styles.thingText}
          placeholder="Событие"
          onChangeText={(text) => setEvent(text)}
          defaultValue={event}
        />
      </View>
      <View style={styles.saveView}>
        <Button
          title="Удалить"
          onPress={() => {
            removeOutfit();
          }}
          color="#FF3B30"
          disabled={route.params?.id ? false : true}
        />
        <Button title="Сохранить" onPress={saveOutfit} />
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
