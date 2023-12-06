import React, { useEffect, useRef, useState } from 'react';
import {
  Button,
  Dimensions,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import Canvas, { Image as CanvasImage } from 'react-native-canvas';

const WIDTH = Dimensions.get('window').width;
let arrayChecked;
let arrayData;

let clearArrayChecked = (width, height) => {
  arrayChecked = [];
  for (let i = 0; i <= width; i++) {
    arrayChecked[i] = [];
    for (let j = 0; j <= height; j++) arrayChecked[i][j] = 0;
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

let loadImageDataTo2DArray = (imageData) => {
  let { width, height, data } = imageData;
  console.dir(data);
  let array = [];
  let dataIndex = 0;

  for (let i = 0; i < height; i++) {
    array[i] = [];
    let rowIndex = 0;
    for (let j = 0; j < width; j++) {
      array[i][rowIndex] = data.subarray(dataIndex, dataIndex + 4);
      rowIndex++;
      dataIndex += 4;
    }
  }
  return array;
};

let toImageData = (array, width, height) => {
  let imageData = new ImageData(width, height);
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
  return imageData;
};

let compare = async (data1, data2) => {
  let R = (data1[0] - data2[0]) ** 2;
  let G = (data1[1] - data2[1]) ** 2;
  let B = (data1[2] - data2[2]) ** 2;
  let a = Math.sqrt(R + G + B);
  return a < 25 ? true : false;
};

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
    arrayData[currentX][currentY].set(fillColor);

    for (let neighbor of neighbors) {
      let newX = currentX + neighbor.dx;
      let newY = currentY + neighbor.dy;

      if (
        newX >= 0 &&
        newY >= 0 &&
        newX < width &&
        newY < height &&
        arrayChecked[newX][newY] !== 1 &&
        compare(arrayData[newX][newY], fg.data)
      ) {
        stack.push({ x: newX, y: newY });
        arrayChecked[newX][newY] = 1;
      }
    }
  }
}

function AddClothesScreen({ navigation }) {
  let [image, setImage] = useState(null);
  let canvasRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current) {
      if (image) {
        let coef = image.width / WIDTH;

        canvasRef.current.width = WIDTH;
        canvasRef.current.height = ~~(image.height / coef);
        loadImageToCanvas(image.uri);

        const convert = async () => {
          let imageData = await canvasRef.current
            .getContext('2d')
            .getImageData(0, 0, WIDTH, canvasRef.current.height);
          loadImageDataTo2DArray(imageData);
          checkArray(
            arrayData,
            canvasRef.current.width,
            canvasRef.current.height
          );
        };
/*
        convert().catch((error) => {
          console.log(error.message);
        });
        */
      }
    }
  }, [image]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.2,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  const loadImageToCanvas = async (uri) => {
    let image = new CanvasImage(canvasRef.current);
    let context = canvasRef.current.getContext('2d');

    clearArrayChecked(canvasRef.current.width, canvasRef.current.height);

    const base64Image = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    image.src = `data:image/png;base64,${base64Image}`;

    //image.src = uri;

    image.addEventListener('load', () => {
      context.drawImage(
        image,
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
    });
  };

  const onPressCanvas = (event) => {
    let coordX = ~~event.nativeEvent.locationX;
    let coordY = ~~event.nativeEvent.locationY;
    console.log({x: coordX, y: coordY});/*
    let foo = async () => {
      let pixel = await canvasRef.current
        .getContext('2d')
        .getImageData(coordX, coordY, 1, 1);
      console.time('Execution Time');
      fillXORArray(
        coordY,
        coordX,
        pixel,
        canvasRef.current.width,
        canvasRef.current.height
      );
      let aaa = toImageData(
        arrayData,
        canvasRef.current.width,
        canvasRef.current.height
      );
      canvasRef.current.putImageData(aaa, 0, 0);
      console.timeEnd('Execution Time');
    };
    foo().catch((error) => {
      console.log(error.message);
    });*/
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <Button title="Pick an image from camera roll" onPress={pickImage} />
      <TouchableWithoutFeedback onPress={onPressCanvas}>
        <View>
          <Canvas ref={canvasRef} />
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}

const styles = StyleSheet.create({});

export default AddClothesScreen;
