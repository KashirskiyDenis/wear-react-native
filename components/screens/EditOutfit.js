import { useRef, useState } from 'react';
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

let WIDTH = Dimensions.get('window').width;
let HEIGHT = WIDTH;
let resizes = ['nw-resize', 'ne-resize', 'se-resize', 'sw-resize'];

function EditOutfit({ navigation, route }) {
  let [rotateArrowDisplay, setRotateArrowDisplay] = useState('none');
  let [cornerRadius] = useState(8);
  let [corners, setCorners] = useState({
    'nw-resize': { cx: 0, cy: 0, display: 'none' },
    'ne-resize': { cx: 0, cy: 0, display: 'none' },
    'se-resize': { cx: 0, cy: 0, display: 'none' },
    'sw-resize': { cx: 0, cy: 0, display: 'none' },
  });
  let [figures, setFigures] = useState([]);
  let [currentFigure, setCurrentFigure] = useState(null);
  let [shiftX, setShiftX] = useState();
  let [shiftY, setShiftY] = useState();

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

  let addFigure = () => {
    let newRect = { type: 'rect' };
    newRect.id = +new Date();
    newRect.x = 50;
    newRect.y = 50;
    newRect.width = 290;
    newRect.height = 290;
    newRect.fill = '#d5e8d4';
    newRect.opacity = 0.8;
    // newRect.setAttribute('transform', `rotate(15, 100, 100)`);
    // newRect.addEventListener('pointerdown', figureMouseDown);
    setFigures([...figures, newRect]);
  };

  let getDraggbleFigure = (id) => {
    for (let i = 0; i < figures.length; i++) {
      if (figures[i].id == id) {
        figures.push(figures.splice(i, 1));
        console.log(figures[figures.length - 1]);
        return figures[figures.length - 1];
      }
    }
  };

  let figureMouseDown = (id, event) => {
    let draggbleFigure = getDraggbleFigure(id);
    console.log(draggbleFigure);
    console.log('locationX ' + event.nativeEvent.locationX);
    console.log('locationY ' + event.nativeEvent.locationY);
    // console.log('pageX ' + event.nativeEvent.pageX);
    // console.log('pageY ' + event.nativeEvent.pageY);
    let shiftX = +event.nativeEvent.locationX - draggbleFigure.x;
    let shiftY = +event.nativeEvent.locationY - draggbleFigure.y;
    console.log('shiftX ' + shiftX);
    console.log('shiftY ' + shiftY);
    // let rotate = draggbleFigure.getAttribute('transform');

    // if (rotate) {
    //   draggbleFigure.removeAttribute('transform');
    // }

    // shiftX = ~~(event.clientX - draggbleFigure.getBoundingClientRect().x);
    // shiftY = ~~(event.clientY - draggbleFigure.getBoundingClientRect().y);

    // if (rotate) {
    //   draggbleFigure.setAttribute('transform', rotate);
    // }

    // cornersMove();
    // cornersAndRotateArrowToForeground();
    // rotateArrowMove();

    // svg.addEventListener('pointermove', figureMouseDownAndMove);
    // draggbleFigure.addEventListener('pointerup', figureMouseUp);
  };

  let toggle = () => {
    cornersDisplayBlock();
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
                  opacity={figure.opacity}
                  onPressIn={(event) => figureMouseDown(figure.id, event)}
                />
            );
          })}
          <SVGImage
            id="rotate-arrow"
            href={require('../../assets/rotate.png')}
            height={24}
            width={24}
            display={rotateArrowDisplay}
            style={styles.svgRotate}
          />
          <Circle
            id="nw-resize"
            cx={corners['nw-resize'].cx}
            cy={corners['nw-resize'].cy}
            r={cornerRadius}
            fill="#29b6f2"
            display={corners['nw-resize'].display}
            opacity={0.5}
          />
          <Circle
            id="ne-resize"
            cx={corners['ne-resize'].cx}
            cy={corners['ne-resize'].cy}
            r={cornerRadius}
            fill="#29b6f2"
            display={corners['ne-resize'].display}
            opacity={0.5}
          />
          <Circle
            id="se-resize"
            cx={corners['se-resize'].cx}
            cy={corners['se-resize'].cy}
            r={cornerRadius}
            fill="#29b6f2"
            display={corners['se-resize'].display}
            opacity={0.5}
          />
          <Circle
            id="sw-resize"
            cx={corners['sw-resize'].cx}
            cy={corners['sw-resize'].cy}
            r={cornerRadius}
            fill="#29b6f2"
            display={corners['sw-resize'].display}
            opacity={0.5}
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
