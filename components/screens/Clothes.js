import { useContext, useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Button,
  Image,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import PopupPicker from '../PopupPicker';
import PopupColorPicker from '../PopupColorPicker';
import PopupInputPicker from '../PopupInputPicker';

import { DatabaseContext } from '../../DatabaseContext';
import { VariableContext } from '../../VariableContext';

function Clothes({ navigation, route }) {
  const { createClothes, updateClothes, deleteClothes } =
    useContext(DatabaseContext);
  const { mapImageClothesPOST, thingTypeList } = useContext(VariableContext);

  const seasonList = [
    { label: 'Зимняя', value: 'Зимняя' },
    { label: 'Весенне-осенняя', value: 'Весенне-осенняя' },
    { label: 'Летняя', value: 'Летняя' },
    { label: 'Всесезонная', value: 'Всесезонная' },
  ];
  const typeList = [
    { label: 'Одежда', value: 'Одежда' },
    { label: 'Обувь', value: 'Обувь' },
  ];

  let categoryThingList = thingTypeList.map((item) => {
    return { label: item, value: item };
  });

  let [type, setType] = useState(route.params?.type ? route.params.type : '');
  let [category, setCategory] = useState(
    route.params?.category ? route.params.category : ''
  );
  let [season, setSeason] = useState(
    route.params?.season ? route.params.season : ''
  );
  let [color, setColor] = useState(
    route.params?.color ? route.params.color : ''
  );

  let [image, setImage] = useState(require('../../assets/thing_grey.png'));

  let fadeAnimate = useRef(new Animated.Value(0)).current;
  let [snackbarText, setSnackbarText] = useState('');
  let [snackbarStatus, setSnackbarStatus] = useState('');
  let [snackbarVisible, setSnackbarVisible] = useState('none');

  let saveClothes = async () => {
    if (type == '' || category == '' || season == '' || color == '') {
      showSnackbar('Не сохранено. Заполните все поля.', 'error');
      return;
    }

    if (route.params?.id) {
      updateClothes(
        route.params.id,
        type,
        route.params.path,
        category,
        season,
        color,
        route.params.size.width,
        route.params.size.height
      )
        .then(() => {
          mapImageClothesPOST(route.params.id, {
            uri: route.params.uri,
            width: route.params.size.width,
            height: route.params.size.height,
          });
        })
        .catch(() => {
          showSnackbar('Ошибка обновления.', 'error');
          return;
        });
    } else {
      if (route.params?.path) {
        createClothes(
          route.params.path,
          type,
          category,
          season,
          color,
          route.params.size.width,
          route.params.size.height
        )
          .then((value) => {
            route.params.id = value;
            mapImageClothesPOST(value, {
              uri: route.params.uri,
              width: route.params.size.width,
              height: route.params.size.height,
            });
          })
          .catch(() => {
            showSnackbar('Ошибка сохранения.', 'error');
            return;
          });
      } else {
        showSnackbar('Не сохранено. Выберите картинку вещи.', 'error');
        return;
      }
    }

    showSnackbar('Изменения сохранены.', 'success');
  };

  let removeClothesFromDB = () => {
    deleteClothes(route.params.id)
      .then(() => {
        navigation.navigate('Home');
      })
      .catch(() => {
        showSnackbar('Карточка вещи не удалена.', 'error');
      });
  };

  let removeClothes = () => {
    Alert.alert(
      'Удалить вещь',
      'Вы действительно хотите удалить данную вешь?',
      [
        {
          text: 'Нет',
          style: 'cancel',
          isPreferred: true,
        },
        {
          text: 'Да',
          onPress: removeClothesFromDB,
          style: 'destructive',
        },
      ]
    );
  };

  useEffect(() => {
    if (route.params?.data) {
      setImage('data:image/png;base64,' + route.params.uri);
    }
  }, [route]);

  let showSnackbar = (text, status) => {
    setSnackbarVisible('block');
    setSnackbarText(text);
    setSnackbarStatus(status);
    fadeIn();
  };

  let fadeIn = () => {
    Animated.timing(fadeAnimate, {
      toValue: 1.0,
      duration: 0,
      useNativeDriver: true,
    }).start(() => {
      fadeOut();
    });
  };

  let fadeOut = () => {
    Animated.timing(fadeAnimate, {
      toValue: 0.85,
      duration: 3000,
      useNativeDriver: true,
    }).start(() => {
      setSnackbarVisible('none');
    });
  };

  return (
    <View style={styles.container}>
      <View style={{ alignItems: 'center' }}>
        <Image
          style={styles.thingImage}
          source={
            route.params?.uri
              ? {
                  uri: 'data:image/png;base64,' + route.params.uri,
                }
              : image
          }
        />
        <Button
          title="Изменить фото"
          onPress={() =>
            navigation.navigate(
              'EditPhotoScreen',
              route.params?.uri ? { uri: route.params.uri } : null
            )
          }
        />
      </View>
      <View style={styles.padding}>
        <PopupPicker
          label="Тип вещи"
          data={typeList}
          select={{ label: type, value: type }}
          onSelect={setType}
          fontSize={20}
        />
        <PopupInputPicker
          label="Категория вещи"
          data={categoryThingList}
          select={{ label: category, value: category }}
          onSelect={setCategory}
          fontSize={20}
        />
        <PopupPicker
          label="Сезон вещи"
          data={seasonList}
          select={{ label: season, value: season }}
          onSelect={setSeason}
          fontSize={20}
        />
        <PopupColorPicker
          label="Цвет вещи"
          selectedColor={color}
          onSelect={setColor}
          fontSize={20}
        />
      </View>
      <View style={styles.saveView}>
        <View style={styles.androidButton}>
          <Button
            title="Удалить"
            onPress={() => {
              removeClothes();
            }}
            color="#FF3B30"
            disabled={route.params?.id ? false : true}
          />
        </View>
        <View style={styles.androidButton}>
          <Button
            title="Сохранить"
            onPress={() => {
              saveClothes();
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
          { opacity: fadeAnimate },
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
  padding: {
    padding: 5,
  },
  thingImage: {
    width: 250,
    height: 250,
    resizeMode: 'cover',
    borderRadius: 250,
    borderWidth: 1,
    borderColor: '#000000',
    marginVertical: 15,
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
    width: '100%',
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

export default Clothes;
