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

let draggbleFigure;
let shiftX, shiftY;
let startRotationX;
let startRotationY;
let startRotationAngle = 0;
let lineA, lineB;
let currentCorner;
let cornerShiftX;
let cornerShiftY;
let startX, startY;
let startWidth, startHeight;

function EditOutfit({ navigation, route }) {
  let [rotateArrow, setRotateArrow] = useState({ x: 0, y: 0, display: 'none' });
  let [borderRotate, setBorderRotate] = useState({ display: 'none' });
  let [cornerRadius] = useState(8);
  let [corners, setCorners] = useState({
    'nw-resize': {
      id: 'nw-resize',
      cx: 0,
      cy: 0,
      display: 'none',
      opacity: 0.5,
    },
    'ne-resize': {
      id: 'ne-resize',
      cx: 0,
      cy: 0,
      display: 'none',
      opacity: 0.5,
    },
    'se-resize': {
      id: 'se-resize',
      cx: 0,
      cy: 0,
      display: 'none',
      opacity: 0.5,
    },
    'sw-resize': {
      id: 'sw-resize',
      cx: 0,
      cy: 0,
      display: 'none',
      opacity: 0.5,
    },
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

    changeRotateCoordinates();

    rotateArrowDisplayNone();
    cornersDisplayNone();
  };

  let figureMouseUp = () => {
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
    borderRotate.display = 'block';

    setBorderRotate(borderRotate);
  };

  let rotateArrowMouseDown = (event) => {
    addBorderRotate();
    cornersDisplayNone();

    let rotate = draggbleFigure.transform;

    if (rotate) {
      startRotationAngle = +rotate.split('(')[1].split(',')[0];
    }

    startRotationX = event.nativeEvent.locationX;
    startRotationY = event.nativeEvent.locationY;
  };

  let rotateArrowMouseDownAndMove = (event) => {
    let { rotateX, rotateY } = calculateCenterCoordinates();
    if (event.nativeEvent.locationX < 0 || event.nativeEvent.locationY < 0)
      return;
    let angle = angleBetweenVectors(
      { x: rotateX, y: rotateY },
      { x: startRotationX, y: startRotationY },
      { x: rotateX, y: rotateY },
      { x: event.nativeEvent.locationX, y: event.nativeEvent.locationY }
    );

    borderRotate.transform = `rotate(${angle}, ${rotateX}, ${rotateY})`;
    borderRotate.transform = `rotate(${angle}, ${rotateX}, ${rotateY})`;
  };

  let rotateArrowMouseUp = () => {
    draggbleFigure.transform = borderRotate.transform;
    borderRotate.display = 'none';
    cornersMove();
    cornersDisplayBlock();
    rotateArrowMove();
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

  let getCenterCornerCoordinates = (corner) => {
    let angleInRadians = 0;
    let rotate = draggbleFigure.transform;

    if (rotate) {
      let angle = +rotate.split('(')[1].split(',')[0];
      angleInRadians = (angle * Math.PI) / 180;
    }

    let cx = corner.cx;
    let cy = corner.cy;
    let { rotateX, rotateY } = calculateCenterCoordinates();
    let newX =
      rotateX +
      (cx - rotateX) * Math.cos(angleInRadians) -
      (cy - rotateY) * Math.sin(angleInRadians);
    let newY =
      rotateY +
      (cx - rotateX) * Math.sin(angleInRadians) +
      (cy - rotateY) * Math.cos(angleInRadians);

    return { x: newX, y: newY };
  };

  let getCoordinatesLineA = (corner) => {
    let cornerA;

    if (corner.id == 'nw-resize') {
      cornerA = getCenterCornerCoordinates(corners['sw-resize']);
    } else if (corner.id == 'ne-resize') {
      cornerA = getCenterCornerCoordinates(corners['nw-resize']);
    } else if (corner.id == 'se-resize') {
      cornerA = getCenterCornerCoordinates(corners['sw-resize']);
    } else if (corner.id == 'sw-resize') {
      cornerA = getCenterCornerCoordinates(corners['nw-resize']);
    }

    return { x: cornerA.x, y: cornerA.y };
  };

  let cornerMouseDown = (id, event) => {
    currentCorner = corners[id];
    lineB = getCenterCornerCoordinates(currentCorner);
    lineA = getCoordinatesLineA(currentCorner);

    cornerShiftX = lineB.x - event.nativeEvent.locationX;
    cornerShiftY = lineB.y - event.nativeEvent.locationY;

    startWidth = draggbleFigure.width;
    startHeight = draggbleFigure.height;
    startX = draggbleFigure.x;
    startY = draggbleFigure.y;

    cornersDisplayNoneBesides(currentCorner);
    rotateArrow.display = 'none';
  };

  let pointRelativeToLine = (a, b, c) => {
    let p = c.x * (b.y - a.y) - c.y * (b.x - a.x) + a.y * b.x - a.x * b.y;
    return p;
  };

  let distanceFromPointToLine = (a, b, c) => {
    let p = Math.abs(pointRelativeToLine(a, b, c));
    let base = Math.sqrt((b.y - a.y) ** 2 + (b.x - a.x) ** 2);

    return p / base;
  };

  let cornerMouseDownAndMove = (event) => {
    let newWidth = startWidth;
    let newHeight = startHeight;
    let newX = startX;
    let newY = startY;
    let currentX = event.nativeEvent.locationX + cornerShiftX;
    let currentY = event.nativeEvent.locationY + cornerShiftY;

    let p = pointRelativeToLine(lineA, lineB, { x: currentX, y: currentY });
    let distance = distanceFromPointToLine(lineA, lineB, {
      x: currentX,
      y: currentY,
    });

    if (currentCorner.id == 'nw-resize') {
      distance = p < 0 ? -1 * distance : distance;
      newX -= distance;
      newY -= distance;
    } else if (currentCorner.id == 'ne-resize') {
      distance = p < 0 ? -1 * distance : distance;
      newY -= distance;
    } else if (currentCorner.id == 'se-resize') {
      distance = p < 0 ? distance : -1 * distance;
    } else if (currentCorner.id == 'sw-resize') {
      distance = p < 0 ? distance : -1 * distance;
      newX -= distance;
    }

    newWidth += distance;
    newHeight += distance;
    newWidth = newWidth < 0 ? 1 : newWidth;
    newHeight = newHeight < 0 ? 1 : newHeight;

    draggbleFigure.x = newX;
    draggbleFigure.y = newY;
    draggbleFigure.width = newWidth;
    draggbleFigure.height = newHeight;

    cornersMove();
  };

  let cornerMouseUp = () => {
    repositionfigureAfterScale();
    rotateArrowMove();
    cornersDisplayBlock();
    rotateArrow.display = 'block';
  };

  let repositionfigureAfterScale = () => {
    let coord = [];
    let angleInRadians;
    let rotate = draggbleFigure.transform;
    let rotateX, rotateY;
    let newRotateX, newRotateY;

    if (rotate) {
      let angle = +rotate.split('(')[1].split(',')[0];
      angleInRadians = (angle * Math.PI) / 180;
      rotateX = +rotate.split(', ')[1];
      rotateY = +rotate.split(', ')[2].slice(0, -1);

      for (let i = 0; i < 4; i++) {
        coord[i] = {
          cx: corners[resizes[i]].cx,
          cy: corners[resizes[i]].cy,
        };
        coord[i].x =
          rotateX +
          (coord[i].cx - rotateX) * Math.cos(angleInRadians) -
          (coord[i].cy - rotateY) * Math.sin(angleInRadians);
        coord[i].y =
          rotateY +
          (coord[i].cx - rotateX) * Math.sin(angleInRadians) +
          (coord[i].cy - rotateY) * Math.cos(angleInRadians);
      }
      newRotateX = (coord[0].x + coord[1].x + coord[2].x + coord[3].x) / 4;
      newRotateY = (coord[0].y + coord[1].y + coord[2].y + coord[3].y) / 4;

      let delta = draggbleFigure.width / 2;
      let x = newRotateX - delta;
      let y = newRotateY - delta;

      draggbleFigure.x = x;
      draggbleFigure.y = y;
      draggbleFigure.transform = `rotate(${angle}, ${newRotateX}, ${newRotateY})`;
    }
  };

  let addFigure = () => {
    let newRect = { type: 'rect' };
    newRect.id = +new Date();
    newRect.x = 50;
    newRect.y = 50;
    newRect.width = 150;
    newRect.height = 150;
    newRect.fill = '#d5e8d4';
    newRect.opacity = 0.8;
    newRect.filter = '';
    newRect.transform = 'rotate(15, 125, 125)';
    setFigures([...figures, newRect]);
  };

  let saveOutfit = () => {};

  return (
    <View style={styles.container}>
      <Button title="Выберите изображение" onPress={pickImage} />
      <Button title="Добавить фигуру" onPress={addFigure} />
      <View style={styles.svgContainer}>
        <Svg width={WIDTH} height={HEIGHT} fill="none" ref={svgRef}>
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
          />
          {figures.map((figure) => {
            return (
              <Rect
                x={figure.x}
                y={figure.y}
                width={figure.width}
                height={figure.height}
                fill="#d5e8d4"
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
            onPressIn={(event) => rotateArrowMouseDown(event)}
            onResponderMove={(event) => rotateArrowMouseDownAndMove(event)}
            onResponderEnd={rotateArrowMouseUp}
          />
          {resizes.map((resize) => {
            return (
              <Circle
                id={resize}
                cx={corners[resize].cx}
                cy={corners[resize].cy}
                r={cornerRadius}
                fill="#29b6f2"
                display={corners[resize].display}
                opacity={corners[resize].opacity}
                transform={corners[resize].transform}
                onPressIn={(event) => cornerMouseDown(resize, event)}
                onResponderMove={(event) => {
                  cornerMouseDownAndMove(event);
                }}
                onResponderEnd={cornerMouseUp}
              />
            );
          })}
        </Svg>
      </View>
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
