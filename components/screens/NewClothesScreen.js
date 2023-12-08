import React, { useEffect, useRef, useState } from 'react';
import {
  Button,
  Dimensions,
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { WebView } from 'react-native-webview';

import htmlContent from '../../assets/webview/html/index';
import jsContent from '../../assets/webview/js/script';
import cssContent from '../../assets/webview/css/style';

let HTML = htmlContent
  .replace('<style></style>', cssContent)
  .replace('<script></script>', jsContent);

function AddClothesScreen({ navigation }) {
  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <WebView
        source={{ html: HTML }}
        scrollEnabled={false}
        javaScriptEnabled={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({});

export default AddClothesScreen;
