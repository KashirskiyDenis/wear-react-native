import { useContext, useRef, useState, useEffect } from 'react';
import {
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
import { data } from '../../services/imageBase64';

function Outfits({ navigation, route }) {
  const { clothes } = useContext(DatabaseContext);
  const seasonList = [
    { label: 'Зимняя', value: 'Зима' },
    { label: 'Весенне-осенняя', value: 'Весенне-осенняя' },
    { label: 'Летняя', value: 'Летняя' },
    { label: 'Демисезонная', value: 'Демисезонная' },
    { label: 'Внесезонная', value: 'Внесезонная' },
  ];

  const imageRef = useRef();

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
    createURIList();
  }, [clothes]);

  useEffect(() => {
    addClothes(image);
  }, [image]);

  let addClothes = () => {
    if (image) {
      let newFigure = { type: 'image' };
      newFigure.id = +new Date();
      newFigure.x = 50;
      newFigure.y = 50;
      newFigure.width = 150;
      newFigure.height = 150;
      newFigure.base64 = image;
      // newFigure.filter = '';
      // newFigure.transform = 'rotate(15, 125, 125)';
      setFigures([...figures, newFigure]);
    }
  };

  // let addFigure = () => {
  //   let newFigure = { type: 'rect' };
  //   newFigure.id = +new Date();
  //   newFigure.x = 50;
  //   newFigure.y = 50;
  //   newFigure.width = 150;
  //   newFigure.height = 150;
  //   newFigure.fill = '#d5e8d4';
  //   newFigure.opacity = 0.8;
  //   // newFigure.filter = '';
  //   // newFigure.transform = 'rotate(15, 125, 125)';
  //   setFigures([...figures, newFigure]);
  // };

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

  let saveOutfit = async () => {
    try {
      const localUri = await captureRef(imageRef, {
        height: 390,
        quality: 0.5,
      });

      if (localUri) {
        let base64 = await getImage(localUri);
        console.log(localUri);

        let folderInfo = await FileSystem.getInfoAsync(
          `${FileSystem.documentDirectory}outfits`
        );
        if (!folderInfo.exists) {
          await FileSystem.makeDirectoryAsync(
            `${FileSystem.documentDirectory}outfits`,
            { intermediates: true }
          );
        }

        let fileName = `${+new Date()}.png`;
        let path = `${FileSystem.documentDirectory}outfits/${fileName}`;
        console.log(path);

        FileSystem.copyAsync('file://' + localUri, path)
          .then((result) => {
            console.log(result);
          })
          .catch((error) => {
            console.log(error.message);
          });
        /*
        try {
          if (season == '' || event == '')
            throw new Error('Not all text fields are filled in');

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
            if (route.params?.path) {
              // createClothes(route.params.path, season, event).then((value) => {
              //   route.params.id = value;
              // });
            } else throw new Error('Not all image fields are filled in');
          }
          setSnackbarVisible('block');
          setSnackbarText('Изменения сохранены');
          setSnackbarStatus('seccess');
          fadeIn();
        } catch (error) {
          console.error('Error saving outftis:', error.message);

          setSnackbarVisible('block');
          setSnackbarText('Не сохранено. Заполните все поля.');
          setSnackbarStatus('error');
          fadeIn();
        }
        */
      }
    } catch (e) {
      console.log(e);
    }
  };

  let getImage = async (pathToFile) => {
    let data = null;
    try {
      data = await FileSystem.readAsStringAsync(pathToFile, {
        encoding: FileSystem.EncodingType.Base64,
      });
    } catch (error) {
      console.log('Error to load file: ' + error.message);
    }
    return data;
  };

  let createURIList = async () => {
    if (clothes.length > 0) {
      let array = [];
      for (let i = 0; i < clothes.length; i++) {
        array[i] = await getImage(clothes[i].pathToFile);
      }
      setClothesImageList(array);
    }
  };

  return (
    <View style={styles.container}>
      {/* <Button title="Добавить фигуру" onPress={addFigure} /> */}
      <PopupImageSelect
        label="Выберите изображение"
        uriList={clothesImageList}
        onSelect={setImage}
        style={{ fontSize: 20 }}
      />
      {/* CustomSVG data={clothesImageList} /> */}
      <View ref={imageRef} collapsable={false}>
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

export default Outfits;
