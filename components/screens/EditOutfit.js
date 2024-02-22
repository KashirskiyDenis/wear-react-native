import { useRef, useState, useEffect } from 'react';
import {
  Animated,
  Button,
  Dimensions,
  PanResponder,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Svg, { Circle, Image as SVGImage, Rect } from 'react-native-svg';
import * as ImagePicker from 'expo-image-picker';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = WIDTH;
const resizes = ['nw-resize', 'ne-resize', 'se-resize', 'sw-resize'];
const filter = 'drop-shadow(5px 5px 5px #aaaaaa)';

let draggbleFigure;
let shiftX, shiftY;
let startRotationX;
let startRotationY;
let startRotationAngle = 0;

function EditOutfit({ navigation, route }) {
  let [rotateArrow, setRotateArrow] = useState({ x: 0, y: 0, display: 'none' });
  let [borderRotate, setBorderRotate] = useState({ display: 'none' });
  let [cornerRadius] = useState(8);
  let [corners, setCorners] = useState({
    'nw-resize': { cx: 0, cy: 0, display: 'none', opacity: 0.5 },
    'ne-resize': { cx: 0, cy: 0, display: 'none', opacity: 0.5 },
    'se-resize': { cx: 0, cy: 0, display: 'none', opacity: 0.5 },
    'sw-resize': { cx: 0, cy: 0, display: 'none', opacity: 0.5 },
  });
  let [figures, setFigures] = useState([]);
  let [currentFigure, setCurrentFigure] = useState(null);

  let svgRef = useRef();
  let rotateArrowRef = useRef();
  let fadeAnim = useRef(new Animated.Value(0)).current;
  let [snackbarText, setSnackbarText] = useState('');
  let [snackbarStatus, setSnackbarStatus] = useState('');

  let pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      // setImage(result.assets[0]);
      alert('Like');
    }
  };

  let cornersDisplayNone = () => {
    for (let i = 0; i < 4; i++) {
      corners[resizes[i]].display = 'none';
    }
    setCorners({ ...corners });
  };

  let cornersDisplayBlock = () => {
    for (let i = 0; i < 4; i++) {
      corners[resizes[i]].display = 'block';
    }
    setCorners({ ...corners });
  };

  let cornersDisplayNoneBesides = (corner) => {
    for (let i = 0; i < 4; i++) {
      if (corner != corners[resizes[i]]) {
        corners[resizes[i]].display = 'none';
      }
    }
    setCorners({ ...corners });
  };

  let cornersMove = () => {
    let width = draggbleFigure.width;
    let height = draggbleFigure.height;
    let x = draggbleFigure.x;
    let y = draggbleFigure.y;
    let neighbors = [
      { dx: x, dy: y },
      { dx: x + width, dy: y },
      { dx: x + width, dy: y + height },
      { dx: x, dy: y + height },
    ];
    let rotate = draggbleFigure.transform;
    for (let i = 0; i < 4; i++) {
      let corner = corners[resizes[i]];
      if (rotate) {
        corner.transform = rotate;
      } else {
        if (corner.transform) {
          corner.transform = '';
        }
      }
      corner.cx = neighbors[i].dx;
      corner.cy = neighbors[i].dy;
    }
    setCorners({ ...corners });
  };

  let rotateArrowMove = () => {
    let width = draggbleFigure.width;
    let x = draggbleFigure.x + width + 16;
    let y = draggbleFigure.y - 32;
    let rotate = draggbleFigure.transform;

    rotateArrow.x = x;
    rotateArrow.y = y;
    if (rotate) {
      rotateArrow.transform = rotate;
    } else {
      if (rotateArrow.transform) {
        rotateArrow.transform = '';
      }
    }
    setRotateArrow(rotateArrow);
  };

  let rotateArrowDisplayBlock = () => {
    rotateArrow.display = 'block';
    setRotateArrow(rotateArrow);
  };

  let rotateArrowDisplayNone = () => {
    rotateArrow.display = 'none';
    setRotateArrow(rotateArrow);
  };

  let calculateCenterCoordinates = () => {
    let x = draggbleFigure.x;
    let y = draggbleFigure.y;
    let width = draggbleFigure.width;
    let height = draggbleFigure.height;
    let neighbors = [
      { dx: x, dy: y },
      { dx: x + width, dy: y },
      { dx: x + width, dy: y + height },
      { dx: x, dy: y + height },
    ];
    let newX =
      (neighbors[0].dx + neighbors[1].dx + neighbors[2].dx + neighbors[3].dx) /
      4;
    let newY =
      (neighbors[0].dy + neighbors[1].dy + neighbors[2].dy + neighbors[3].dy) /
      4;

    return { rotateX: newX, rotateY: newY };
  };

  let changeRotateCoordinates = () => {
    let rotate = draggbleFigure.transform;

    if (rotate) {
      let angle = +rotate.split('(')[1].split(',')[0];
      let { rotateX, rotateY } = calculateCenterCoordinates();
      draggbleFigure.transform = `rotate(${angle}, ${rotateX}, ${rotateY})`;
    }
  };

  let getDraggbleFigure = (id) => {
    for (let i = 0; i < figures.length; i++) {
      if (figures[i].id == id) {
        figures.push(...figures.splice(i, 1));
        return figures[figures.length - 1];
      }
    }
  };

  let figureMouseDown = (id, event) => {
    draggbleFigure = getDraggbleFigure(id);

    shiftX = event.nativeEvent.locationX - draggbleFigure.x;
    shiftY = event.nativeEvent.locationY - draggbleFigure.y;

    cornersMove();
    rotateArrowMove();
  };

  let figureMouseDownAndMove = (event) => {
    draggbleFigure.x = event.nativeEvent.locationX - shiftX;
    draggbleFigure.y = event.nativeEvent.locationY - shiftY;
    // draggbleFigure.filter = filter;

    changeRotateCoordinates();

    rotateArrowDisplayNone();
    cornersDisplayNone();
  };

  let figureMouseUp = () => {
    // svg.removeEventListener('pointermove', figureMouseDownAndMove);
    // draggbleFigure.removeAttribute('filter');

    cornersMove();
    cornersDisplayBlock();
    rotateArrowMove();
    rotateArrowDisplayBlock();
  };

  let addBorderRotate = () => {
    borderRotate.x = draggbleFigure.x;
    borderRotate.y = draggbleFigure.y;
    borderRotate.width = draggbleFigure.width;
    borderRotate.height = draggbleFigure.height;
    borderRotate.transform = draggbleFigure.transform;

    setBorderRotate(borderRotate);
  };

  let rotateArrowMouseDown = (event) => {
    addBorderRotate();
    cornersDisplayNone();

    startRotationX = event.nativeEvent.locationX;
    startRotationY = event.nativeEvent.locationY;
  };

  let angleBetweenVectors = (
    coordVector1_b,
    coordVector1_e,
    coordVector2_b,
    coordVector2_e
  ) => {
    let vector1 = {
      x: coordVector1_e.x - coordVector1_b.x,
      y: coordVector1_e.y - coordVector1_b.y,
    };
    let vector2 = {
      x: coordVector2_e.x - coordVector2_b.x,
      y: coordVector2_e.y - coordVector2_b.y,
    };
    let angleInRadians =
      Math.atan2(vector2.y, vector2.x) - Math.atan2(vector1.y, vector1.x);
    let angleInDegrees = (180 / Math.PI) * angleInRadians;
    angleInDegrees += startRotationAngle;

    if (angleInDegrees < 0) {
      angleInDegrees += 360;
    }

    return ~~(angleInDegrees % 360);
  };

  let toggle = () => {
    cornersDisplayBlock();
    rotateArrow.display = 'block';
    setRotateArrow(rotateArrow);
  };

  let addFigure = () => {
    let newRect = { type: 'rect' };
    newRect.id = +new Date();
    newRect.x = 50;
    newRect.y = 50;
    newRect.width = 290;
    newRect.height = 290;
    newRect.fill = '#d5e8d4';
    newRect.opacity = 0.8;
    newRect.filter = '';
    newRect.transform = 'rotate(15, 195, 195)';
    setFigures([...figures, newRect]);
  };

  return (
    <View style={styles.container}>
      <Button title="Выберите изображение" onPress={pickImage} />
      <Button title="Добавить фигуру" onPress={addFigure} />
      <View style={styles.svgContainer}>
        <Svg width={WIDTH} height={HEIGHT} fill="none" ref={svgRef}>
          {figures.map((figure) => {
            return (
              <Rect
                x={figure.x}
                y={figure.y}
                width={figure.width}
                height={figure.height}
                fill="#d5e8d4"
                filter="drop-shadow(5px 5px 5px #aaaaaa)"
                opacity={figure.opacity}
                transform={figure.transform}
                onPressIn={(event) => figureMouseDown(figure.id, event)}
                onResponderMove={(event) => figureMouseDownAndMove(event)}
                onResponderEnd={figureMouseUp}
              />
            );
          })}
          <SVGImage
            id="rotate-arrow"
            href={require('../../assets/rotate.png')}
            x={rotateArrow.x}
            y={rotateArrow.y}
            height={24}
            width={24}
            transform={rotateArrow.transform}
            display={rotateArrow.display}
            style={styles.svgRotate}
          />
          <Rect
            x={borderRotate.x}
            y={borderRotate.y}
            width={borderRotate.width}
            height={borderRotate.height}
            fill="transparent"
            stroke="#29b6f2"
            display={borderRotate.display}
            strokeDasharray={3}
            transform={borderRotate.transform}
            onPressIn={(event) => figureMouseDown(figure.id, event)}
            onResponderMove={(event) => figureMouseDownAndMove(event)}
            onResponderEnd={figureMouseUp}
          />
          <Circle
            id="nw-resize"
            cx={corners['nw-resize'].cx}
            cy={corners['nw-resize'].cy}
            r={cornerRadius}
            fill="#29b6f2"
            display={corners['nw-resize'].display}
            opacity={corners['nw-resize'].opacity}
            transform={corners['nw-resize'].transform}
          />
          <Circle
            id="ne-resize"
            cx={corners['ne-resize'].cx}
            cy={corners['ne-resize'].cy}
            r={cornerRadius}
            fill="#29b6f2"
            display={corners['ne-resize'].display}
            opacity={corners['ne-resize'].opacity}
            transform={corners['ne-resize'].transform}
          />
          <Circle
            id="se-resize"
            cx={corners['se-resize'].cx}
            cy={corners['se-resize'].cy}
            r={cornerRadius}
            fill="#29b6f2"
            display={corners['se-resize'].display}
            opacity={corners['se-resize'].opacity}
            transform={corners['se-resize'].transform}
          />
          <Circle
            id="sw-resize"
            cx={corners['sw-resize'].cx}
            cy={corners['sw-resize'].cy}
            r={cornerRadius}
            fill="#29b6f2"
            display={corners['sw-resize'].display}
            opacity={corners['sw-resize'].opacity}
            transform={corners['sw-resize'].transform}
          />
        </Svg>
      </View>
      <Button title="Toogle" onPress={toggle} />
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
  svgContainer: {
    borderTopWidth: 1,
    borderBottomWidth: 2,
    borderStyle: 'solid',
    borderColor: 'powderblue',
  },
  svgRotate: {
    cursor: 'crosshair',
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

export default EditOutfit;
