import { useContext, useEffect, useState } from 'react';
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

let seasonColor = new Map([
  ['Зимняя', '#6e9abc'],
  ['Весенне-осенняя', '#bfff00'],
  ['Летняя', '#d20117'],
  ['Всесезонная', '#c0c0c0'],
]);

let groupByList = [
  { key: 'category', value: 'Категории' },
  { key: 'season', value: 'Сезоны' },
  { key: 'color', value: 'Цвета' },
];

function WardrobeScreen({ navigation }) {
  let { clothes, outfits, readClothesGroupBy } = useContext(DatabaseContext);
  let [groupBy, setGroupBy] = useState('season');
  let [groupData, setGroupData] = useState([]);

  useEffect(() => {
    if (groupBy == 'category') {
      readClothesGroupBy(groupBy).then((result) => {
        let arr = result.map((item) => {
          return {
            title: item.category,
            value: item.count,
            color: getRandomColor(),
          };
        });
        setGroupData(arr);
      });
    } else if (groupBy == 'season') {
      readClothesGroupBy(groupBy).then((result) => {
        let arr = result.map((item) => {
          return {
            title: item.season,
            value: item.count,
            color: seasonColor.get(item.season),
          };
        });
        setGroupData(arr);
      });
    } else if (groupBy == 'color') {
    }
  }, [clothes, groupBy]);

  return (
    <View style={styles.container}>
      <MultiSwitch
        data={groupByList}
        activeKey={groupBy}
        onChange={setGroupBy}
      />
      <DonutChart size={WIDTH - 20} data={groupData} />
      <Text style={styles.allWear}>Всего вещей: {clothes.length}</Text>
      <GroupList data={groupData} />
      <Text style={styles.allWear}>Всего образов: {outfits.length}</Text>
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.addButton}
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
    fontSize: 16,
    marginBottom: 5,
  },
  addButton: {
    position: 'absolute',
    right: 15,
    bottom: 15,
  },
});

export default WardrobeScreen;
