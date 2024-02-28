import React from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import DonutChart from '../DonutChart';
import SortList from '../SortList';
import AddButton from '../AddButton';

const WIDTH = Dimensions.get('window').width;

const getRandom = () => {
  return Math.floor(Math.random() * 256);
};

const getRandomColor = () => {
  let red = getRandom();
  let green = getRandom();
  let blue = getRandom();

  return `rgb(${red}, ${green}, ${blue})`;
};

const colors = [
  getRandomColor(),
  getRandomColor(),
  getRandomColor(),
  getRandomColor(),
  getRandomColor(),
];

function WardrobeScreen({ navigation }) {
  const [countWear, setCountWear] = React.useState(0);
  const [isPressCategory, setIsPressCategory] = React.useState(true);
  const [isPressSeason, setIsPressSeason] = React.useState(false);
  const [isPressColor, setIsPressColor] = React.useState(false);

  const onPressSort = (props) => {
    if (props == 'category') {
      setIsPressCategory(true);
      setIsPressSeason(false);
      setIsPressColor(false);
    } else if (props == 'season') {
      setIsPressCategory(false);
      setIsPressSeason(true);
      setIsPressColor(false);
    } else if (props == 'color') {
      setIsPressCategory(false);
      setIsPressSeason(false);
      setIsPressColor(true);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff', padding: 10 }}>
      <View style={styles.sortMenu}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => onPressSort('category')}>
          <View style={isPressCategory ? styles.sortActive : styles.sort}>
            <Text style={styles.sizeTextSort}>Категории</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => onPressSort('season')}>
          <View style={isPressSeason ? styles.sortActive : styles.sort}>
            <Text style={styles.sizeTextSort}>Сезоны</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => onPressSort('color')}>
          <View style={isPressColor ? styles.sortActive : styles.sort}>
            <Text style={styles.sizeTextSort}>Цвета</Text>
          </View>
        </TouchableOpacity>
      </View>
      <DonutChart
        widthAndHeight={WIDTH - 10}
        data={[30, 60, 90, 120, 60]}
        colors={colors}
      />
      <Text style={styles.allWear}>Всего вещей: {countWear}</Text>
      <SortList data={[30, 60, 90, 120, 60]} colors={colors} />
      <TouchableOpacity
        activeOpacity={0.8}
        style={{
          position: 'absolute',
          right: 15,
          bottom: 15,
        }}
        onPress={() => navigation.navigate('EditClothesScreen')}>
        <AddButton />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  sortMenu: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    zIndex: 2,
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
    fontSize: 24,
    marginBottom: 5,
  },
});

export default WardrobeScreen;
