import { useState, useRef } from 'react';
import {
  Button,
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import { WebView } from 'react-native-webview';

import htmlContent from '../assets/webview/html/colorPicker';
import cssContent from '../assets/webview/css/colorPicker';
import jsContent from '../assets/webview/js/colorPicker';

const { width } = Dimensions.get('window');
let canvasWidth = width * 0.8 - 20 - 2;
let canvasHeight = canvasWidth - 30 - 2 - 5;
let modalViewHeight = width * 0.9;

let newCSS = `${cssContent}`.replace('canvasSize', `${canvasWidth}px;`);
let newJS = `${jsContent}`
  .replace('let canvasHeight;', `let canvasHeight = ${canvasHeight};`)
  .replace('let canvasWidth;', `let canvasWidth = ${canvasWidth};`);

let HTML = htmlContent.replace('<style></style>', newCSS);

function PopupColorPicker({ label, onSelect, fontSize, selectedColor }) {
  let [visible, setVisible] = useState(false);
  let [color, setColor] = useState(selectedColor ? selectedColor : null);

  let webViewRef = useRef();

  let handleLoadEnd = () => {
    if (selectedColor) {
      newJS = newJS.replace('let color;', `let color = '${selectedColor}';`);
      newJS = newJS.replace(
        /let color = 'rgb\(\d{0,3},\s\d{0,3},\s\d{0,3}\)';/,
        `let color = '${selectedColor}';`
      );
    }
    webViewRef.current.injectJavaScript(newJS);
  };

  let toggleModal = () => {
    visible ? setVisible(false) : openModal();
  };

  let openModal = () => {
    setVisible(true);
  };

  let onMessage = (event) => {
    let data = event.nativeEvent.data;
    color = data;
  };

  let pickColor = () => {
    setColor(color);
    onSelect(color);
    setVisible(false);
  };

  let renderModal = () => {
    if (visible) {
      return (
        <Modal
          visible={visible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => {
            setVisible(false);
          }}>
          <TouchableOpacity
            onPress={() => {
              setVisible(false);
            }}
            style={styles.centeredView}>
            <TouchableWithoutFeedback>
              <View style={styles.modalView}>
                <WebView
                  ref={webViewRef}
                  originWhitelist={['*']}
                  source={{ html: HTML }}
                  scrollEnabled={false}
                  javaScriptEnabled={true}
                  onMessage={(event) => onMessage(event)}
                  onLoadEnd={handleLoadEnd}
                />
                <Button
                  title="Применить"
                  onPress={() => {
                    pickColor();
                  }}
                />
              </View>
            </TouchableWithoutFeedback>
          </TouchableOpacity>
        </Modal>
      );
    }
  };

  return (
    <TouchableOpacity onPress={toggleModal}>
      {renderModal()}
      <View style={styles.button}>
        <View>
          <Text
            style={[
              { fontSize: fontSize },
              color ? {} : styles.placeholderTextColor,
            ]}>
            {label}
          </Text>
        </View>
        <View
          style={[
            styles.smallColor,
            { backgroundColor: color, width: fontSize, height: fontSize },
            color ? {} : { borderWidth: 1, borderColor: '#007aff' },
          ]}></View>
      </View>
    </TouchableOpacity>
  );
}

let styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0000002a',
  },
  modalView: {
    backgroundColor: '#ffffff',
    padding: 10,
    borderRadius: 7,
    width: '80%',
    height: modalViewHeight,
  },
  button: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    padding: 5,
    marginVertical: 5,
    borderLeftWidth: 1,
    borderLeftColor: '#007aff',
  },
  smallColor: {
    width: 14,
    height: 14,
    backgroundColor: 'red',
    borderRadius: 14,
  },
  placeholderTextColor: {
    color: '#8e8e93',
  },
});

export default PopupColorPicker;
