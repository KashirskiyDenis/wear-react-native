import { useContext, useEffect, useRef, useState } from 'react';
import {
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

function EditClothes({ navigation, route }) {
  const { createClothes, updateClothes } = useContext(DatabaseContext);

  const [selected, setSelected] = useState(undefined);
  const data = [
    { label: 'One', value: '1' },
    { label: 'Two', value: '2' },
    { label: 'Three', value: '3' },
    { label: 'Four', value: '4' },
    { label: 'Five', value: '5' },
    { label: 'Six', value: '6' },
    { label: 'Seven', value: '7' },
    { label: 'Eight', value: '8' },
    { label: 'Nine', value: '9' },
    { label: 'Zero', value: '0' },
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
  let fadeAnim = useRef(new Animated.Value(0)).current;
  let [snackbarText, setSnackbarText] = useState('');
  let [snackbarStatus, setSnackbarStatus] = useState('');
  let [snackbarVisible, setSnackbarVisible] = useState('none');

  let saveClothes = async () => {
    try {
      if (title == '' || category == '' || season == '' || color == '')
        throw new Error('Not all text fields are filled in');

      if (route.params?.id) {
        updateClothes(
          route.params.id,
          title,
          route.params.path,
          category,
          season,
          color
        );
      } else {
        if (route.params?.path) {
          createClothes(route.params.path, title, category, season, color);
        } else throw new Error('Not all image fields are filled in');
      }
      setSnackbarVisible('block');
      setSnackbarText('Изменения сохранены');
      setSnackbarStatus('seccess');
      fadeIn();
    } catch (error) {
      console.error('Error saving image:', error.message);

      setSnackbarVisible('block');
      setSnackbarText('Не сохранено. Заполните все поля.');
      setSnackbarStatus('error');
      fadeIn();
    }
  };

  useEffect(() => {
    if (route.params?.data) {
      setImage('data:image/png;base64,' + route.params.uri);
    }
  }, [route]);

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
        <TextInput
          style={styles.thingText}
          placeholder="Сезон вещи"
          onChangeText={(text) => setSeason(text)}
          defaultValue={season}
        />

        <PopupSelect label="Select Item" data={data} onSelect={setSelected} />

        <TextInput
          style={styles.thingText}
          placeholder="Цвет вещи"
          onChangeText={(text) => setColor(text)}
          defaultValue={color}
        />
      </View>
      <View style={styles.saveView}>
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
    padding: 5,
  },
  thingImage: {
    width: 250,
    height: 250,
    resizeMode: 'cover',
    borderRadius: 250,
    borderWidth: 1,
    borderColor: '#8f8e8f',
    marginVertical: 15,
  },
  thingTitle: {
    fontSize: 24,
    fontWeight: '600',
    padding: 5,
    marginVertical: 5,
    borderLeftWidth: 1,
  },
  thingText: {
    fontSize: 16,
    padding: 5,
    marginVertical: 5,
    borderLeftWidth: 1,
    borderLeftColor: '#',
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

export default EditClothes;
