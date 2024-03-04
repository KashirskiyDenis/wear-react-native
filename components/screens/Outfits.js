import { useContext, useRef, useState, useEffect } from 'react';
import { Animated, Button, StyleSheet, Text, View } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { DatabaseContext } from '../../DatabaseContext';
import PopupImageSelect from '../PopupImageSelect';
import CustomSVG from '../CustomSVG';
import { data } from '../../services/imageBase64';

function Outfits({ navigation, route }) {
  const { clothes } = useContext(DatabaseContext);

  let [clothesImageList, setClothesImageList] = useState(data);

  let [image, setImage] = useState();
  let [figures, setFigures] = useState([]);

  let fadeAnim = useRef(new Animated.Value(0)).current;
  let [snackbarText, setSnackbarText] = useState('');
  let [snackbarStatus, setSnackbarStatus] = useState('');

  useEffect(() => {
    createURIList();
  }, [clothes]);

  useEffect(() => {
    addFigure(image);
  }, [image]);

  let addFigure = () => {
    let newFigure = { type: 'image' };
    newFigure.id = +new Date();
    newFigure.x = 50;
    newFigure.y = 50;
    newFigure.width = 150;
    newFigure.height = 150;
    newFigure.base64 = image;
    // newFigure.fill = '#d5e8d4';
    // newFigure.opacity = 0.8;
    // newFigure.filter = '';
    // newFigure.transform = 'rotate(15, 125, 125)';
    setFigures([...figures, newFigure]);
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

  let saveOutfit = () => {};

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
      <CustomSVG data={figures} />
      <Button title="Сохранить" onPress={saveOutfit} />
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
