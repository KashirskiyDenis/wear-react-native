import React from 'react';
import {
  Button,
  Dimensions,
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import Canvas, { Image as CanvasImage, ImageData } from 'react-native-canvas';

import AddButton from '../AddButton';

const WIDTH = Dimensions.get('window').width;
let HEIGHT;

let tool = 'bgEraser';
let arrayChecked;
let arrayData;
let imageData;
let canvasImage;
let ctx;

let clearArrayChecked = () => {
  arrayChecked = [];
  for (let i = 0; i <= WIDTH; i++) {
    arrayChecked[i] = [];
    for (let j = 0; j <= HEIGHT; j++) arrayChecked[i][j] = 0;
  }
};

let checkArray = (array, width, height) => {
  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      if (array[i][j].length != 4) {
        console.log({ i: i, j: j });
        return;
      }
    }
  }
};

let to2DArray = (data, width, height) => {
  //let { width, height, data } = imageData;
  arrayData = [];
  let dataIndex = 0;

  for (let i = 0; i < height; i++) {
    let row = [];
    for (let j = 0; j < width; j++) {
      row[j] = data.subarray(dataIndex, dataIndex + 4);
      dataIndex += 4;
    }
    arrayData[i] = row;
  }
};

let toImageData = (array, width, height) => {
  imageData = new ImageData(width, height);
  let index = 0;
  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      imageData.data[index] = array[i][j][0];
      imageData.data[index + 1] = array[i][j][1];
      imageData.data[index + 2] = array[i][j][2];
      imageData.data[index + 3] = array[i][j][3];
      index += 4;
    }
  }
};

function compare(data1, data2) {
  let R = (data1[0] - data2[0]) ** 2;
  let G = (data1[1] - data2[1]) ** 2;
  let B = (data1[2] - data2[2]) ** 2;
  let a = Math.sqrt(R + G + B);
  return a < 25 ? true : false;
}

function filling(event) {
  let coordX = event.nativeEvent.locationX;
  let coordY = event.nativeEvent.locationY;
  let pixel = ctx.getImageData(coordX, coordY, 1, 1);

  console.time('fillXORArray');
  fillXORArray(coordX, coordY, pixel, WIDTH, HEIGHT);
  toImageData(arrayData, WIDTH, HEIGHT);
  ctx.putImageData(imageData, 0, 0);
  console.timeEnd('fillXORArray');

  clearArrayChecked();
}

function fillXORArray(x, y, fg, width, height) {
  const fillColor = new Uint8ClampedArray([0, 255, 0, 255]);
  const neighbors = [
    { dx: 0, dy: -1 },
    { dx: 0, dy: 1 },
    { dx: -1, dy: 0 },
    { dx: 1, dy: 0 },
  ];

  let stack = [{ x, y }];
  arrayChecked[x][y] = 1;

  while (stack.length) {
    let { x: currentX, y: currentY } = stack.pop();
    arrayData[currentY][currentX].set(fillColor);

    for (let neighbor of neighbors) {
      let newX = currentX + neighbor.dx;
      let newY = currentY + neighbor.dy;

      if (
        newX >= 0 &&
        newY >= 0 &&
        newX < width &&
        newY < height &&
        arrayChecked[newX][newY] !== 1 &&
        compare(arrayData[newY][newX], fg.data)
      ) {
        stack.push({ x: newX, y: newY });
        arrayChecked[newX][newY] = 1;
      }
    }
  }
}

let getImage = async (pathToFile) => {
  let data = null;
  try {
    data = await FileSystem.readAsStringAsync(pathToFile, {
      encoding: FileSystem.EncodingType.Base64,
    });
  } catch (error) {
    console.log('Error to load file: ' + error.message);
  }
  return 'data:image/png;base64,' + data;
};

function EditOutfit({ navigation }) {
  let canvasRef = React.useRef();
  let [image, setImage] = React.useState();

  React.useEffect(() => {
    if (canvasRef.current && image) {
      let coef = image.width / WIDTH;
      HEIGHT = ~~(image.height / coef);
      canvasRef.current.height = HEIGHT;
      canvasRef.current.width = WIDTH;
      canvasImage = new CanvasImage(canvasRef.current);

      ctx = canvasRef.current.getContext('2d');
      (async () => {
        canvasImage.src = await getImage(image.uri);
      })();
      canvasImage.addEventListener('load', draw);
    }
  }, [image]);

  let draw = async () => {
    ctx.drawImage(canvasImage, 0, 0, WIDTH, HEIGHT);
    ctx.getImageData(0, 0, WIDTH, HEIGHT).then((imageData) => {
      to2DArray(Object.values(imageData.data), WIDTH, HEIGHT);
      checkArray(arrayData,  WIDTH, HEIGHT);
      clearArrayChecked();
    });
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.2,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Button title="Pick an image from camera roll" onPress={pickImage} />
      <TouchableWithoutFeedback onPress={filling}>
        <View>
          <Canvas ref={canvasRef} height={0} width={0} style={styles.canvas} />
        </View>
      </TouchableWithoutFeedback>
      <Button title="Magic Eraser" />
      <Button title="Background Eraser" />
    </View>
  );
}

const styles = StyleSheet.create({
  canvas: {},
});

export default EditOutfit;
