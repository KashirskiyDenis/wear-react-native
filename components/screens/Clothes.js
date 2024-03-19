import { useContext, useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Button,
  Image,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import PopupSelect from '../PopupSelect';

import { DatabaseContext } from '../../DatabaseContext';
import { VariableContext } from '../../VariableContext';

function Clothes({ navigation, route }) {
  const { createClothes, updateClothes, deleteClothes } =
    useContext(DatabaseContext);
  const { mapImageClothesPOST } = useContext(VariableContext);

  const seasonList = [
    { label: 'Зимняя', value: 'Зима' },
    { label: 'Весенне-осенняя', value: 'Весенне-осенняя' },
    { label: 'Летняя', value: 'Летняя' },
    { label: 'Демисезонная', value: 'Демисезонная' },
    { label: 'Внесезонная', value: 'Внесезонная' },
  ];

  let [title, setTitle] = useState(
    route.params?.title ? route.params.title : ''
  );
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
    if (title == '' || category == '' || season == '' || color == '') {
      showSnackbar('Не сохранено. Заполните все поля.', 'error');
      return;
    }

    if (route.params?.id) {
      updateClothes(
        route.params.id,
        title,
        route.params.path,
        category,
        season,
        color
      )
        .then(() => {
          mapImageClothesPOST(route.params.id, route.params.uri);
        })
        .catch(() => {
          showSnackbar('Ошибка обновления.', 'error');
          return;
        });
    } else {
      if (route.params?.path) {
        createClothes(route.params.path, title, category, season, color)
          .then((value) => {
            route.params.id = value;
            mapImageClothesPOST(value, route.params.uri);
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
      <View>
        <TextInput
          style={styles.thingTitle}
          placeholder="Название вещи"
          onChangeText={(text) => setTitle(text)}
          defaultValue={title}
        />
        <TextInput
          style={styles.thingText}
          placeholder="Категория вещи"
          onChangeText={(text) => setCategory(text)}
          defaultValue={category}
        />
        <PopupSelect
          label="Сезон вещи"
          data={seasonList}
          select={{ label: season, value: season }}
          onSelect={setSeason}
          style={{ fontSize: 20 }}
        />
        <TextInput
          style={styles.thingText}
          placeholder="Цвет вещи"
          onChangeText={(text) => setColor(text)}
          defaultValue={color}
        />
      </View>
      <View style={styles.saveView}>
        <Button
          title="Удалить"
          onPress={() => {
            removeClothes();
          }}
          color="#FF3B30"
          disabled={route.params?.id ? false : true}
        />
        <Button
          title="Сохранить"
          onPress={() => {
            saveClothes();
          }}
        />
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
  thingTitle: {
    backgroundColor: '#ffffff',
    fontSize: 24,
    fontWeight: '600',
    padding: 5,
    marginVertical: 5,
    borderLeftWidth: 1,
  },
  thingText: {
    backgroundColor: '#ffffff',
    fontSize: 20,
    padding: 5,
    borderLeftWidth: 1,
  },
  saveView: {
    flex: 1,
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

export default Clothes;
