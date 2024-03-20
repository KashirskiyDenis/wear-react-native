import { useContext, useState } from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { DatabaseContext } from '../../DatabaseContext';

import DonutChart from '../DonutChart';
import GroupList from '../GroupList';
import AddButton from '../AddButton';
import MultiSwitch from '../MultiSwitch';

const WIDTH = Dimensions.get('window').width;

let getRandom = () => {
  return Math.floor(Math.random() * 256);
};

let getRandomColor = () => {
  let red = getRandom();
  let green = getRandom();
  let blue = getRandom();

  return `rgba(${red}, ${green}, ${blue}, 0.60)`;
};

let colors = [
  getRandomColor(),
  getRandomColor(),
  getRandomColor(),
  getRandomColor(),
  getRandomColor(),
];

let data = [30, 60, 90, 120, 60];
let groupData = colors.map((item, index) => {
  return { data: data[index], color: item };
});
let dataList = [
  { key: 'category', value: 'Категории' },
  { key: 'season', value: 'Сезоны' },
  { key: 'color', value: 'Цвета' },
];

function WardrobeScreen({ navigation }) {
  let { clothes } = useContext(DatabaseContext);
  let [groupBy, setGroupBy] = useState('category');

  return (
    <View style={styles.container}>
      <MultiSwitch data={dataList} activeKey={groupBy} onChange={setGroupBy} />
      <DonutChart widthAndHeight={WIDTH - 10} data={data} colors={colors} />
      <Text style={styles.allWear}>Всего вещей: {clothes.length}</Text>
      <GroupList data={groupData} />
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
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 10,
  },
  allWear: {
    fontSize: 24,
    marginBottom: 5,
  },
});

export default WardrobeScreen;
