import React from 'react';
import {
  Button,
  Dimensions,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import PaiChart from '../PaiChart';

const WIDTH = Dimensions.get('window').width;

function HomeScreen() {
  const [countWear, setCountWear] = React.useState(0);
  const [isPressCategory, setIsPressCategory] = React.useState(true);
  const [isPressSeason, setIsPressSeason] = React.useState(false);
  const [isPressColor, setIsPressColor] = React.useState(false);

  const onPress = () => {};

  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff', padding: 10 }}>
      <View style={styles.fixToText}>
        <TouchableHighlight
          onPress={() => setIsPressCategory(!isPressCategory)}>
          <View style={isPressCategory ? styles.sortActive : styles.sort}>
            <Text style={styles.sizeTextSort}>Категории</Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight onPress={() => setIsPressSeason(!isPressSeason)}>
          <View style={isPressSeason ? styles.sortActive : styles.sort}>
            <Text style={styles.sizeTextSort}>Сезон</Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight onPress={() => setIsPressColor(!isPressColor)}>
          <View style={isPressColor ? styles.sortActive : styles.sort}>
            <Text style={styles.sizeTextSort}>Цвет</Text>
          </View>
        </TouchableHighlight>
      </View>
      <PaiChart widthAndHeight={WIDTH - 10} data={[30, 60, 90, 120, 60]} />
      <Text style={styles.allWear}>Всего вещей: {countWear}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  fixToText: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  sort: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    color: '#000000',
    backgroundColor: '#b1e0e6',
    shadowColor: '#a8a8a8',
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 5,
  },
  sortActive: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    color: '#000000',
    backgroundColor: '#6fabb3',
    shadowColor: '#a8a8a8',
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 5,
  },
  sizeTextSort: {
    fontSize: 20,
  },
  allWear: {
    fontSize: 20,
  },
});

export default HomeScreen;
