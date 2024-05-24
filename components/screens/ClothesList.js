import { useContext, useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AddButton from '../AddButton';
import HeaderLeft from '../HeaderLeft';
import HeaderRight from '../HeaderRight';
import { DatabaseContext } from '../../DatabaseContext';
import { VariableContext } from '../../VariableContext';
import { AntDesign } from '@expo/vector-icons';

function ClothesScreen({ navigation }) {
  const { clothes, deleteClothesMany } = useContext(DatabaseContext);
  const { mapImageClothes } = useContext(VariableContext);

  let [list, setList] = useState();
  let [isSelect, setIsSelect] = useState(false);
  let [selected, setSelected] = useState([]);

  useEffect(() => {
    let parent = navigation.getParent();
    if (selected.length > 0) {
      parent.setOptions({
        headerTitle: '',
        headerLeft: () => <HeaderLeft backFunction={cancelSelected} />,
        headerRight: () => <HeaderRight removeFunction={removeElement} />,
        headerStyle: { backgroundColor: '#efefef' },
      });
      setIsSelect(true);
    } else {
      parent.setOptions({
        headerTitle: 'Гардероб',
        headerLeft: () => null,
        headerRight: () => null,
        headerStyle: { backgroundColor: '#ffffff' },
      });
      setIsSelect(false);
    }
  }, [selected]);

  useEffect(() => {
    createListClothes();
  }, [clothes]);

  let createListClothes = async () => {
    let array = [];
    for (let i = 0; i < clothes.length; i++) {
      array[i] = {
        id: clothes[i].id,
        path: clothes[i].pathToFile,
        uri: mapImageClothes.get(clothes[i].id).uri,
        type: clothes[i].type,
        category: clothes[i].category,
        season: clothes[i].season,
        color: clothes[i].color,
      };
    }
    setList(array);
  };

  let toggleCheckStatus = (item) => {
    if (selected.includes(item.id)) {
      setSelected(selected.filter((elem) => elem !== item.id));
    } else {
      setSelected([...selected, item.id]);
    }
  };

  let cancelSelected = () => {
    setSelected([]);
  };

  let removeElement = () => {
    deleteClothesMany(selected);
    setSelected([]);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={list}
        extraData={selected}
        renderItem={({ item }) => {
          let isSelected = selected.includes(item.id);
          return (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                if (!isSelect) {
                  navigation.navigate('EditClothesScreen', { ...item });
                } else {
                  toggleCheckStatus(item);
                }
              }}
              onLongPress={() => {
                toggleCheckStatus(item);
              }}>
              <View style={[styles.item, isSelected && styles.selectedItem]}>
                <View>
                  <Image
                    style={styles.itemImage}
                    source={{ uri: 'data:image/png;base64,' + item.uri }}
                  />
                  {isSelected && (
                    <View style={styles.selectedIconView}>
                      <AntDesign
                        name="checkcircleo"
                        style={styles.selectedIcon}
                      />
                    </View>
                  )}
                </View>
                <View>
                  <Text style={styles.thingTitle}>{item.category}</Text>
                  <Text style={styles.thingText}>{item.type}</Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
      />
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
  },
  item: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    padding: 10,
  },
  itemImage: {
    width: 50,
    height: 50,
    resizeMode: 'cover',
    marginRight: 15,
    borderRadius: 50,
  },
  thingTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  thingText: {
    color: '#8f8e8f',
  },
  addButton: {
    position: 'absolute',
    right: 15,
    bottom: 15,
  },
  selectedItem: {
    backgroundColor: '#e0efff',
  },
  selectedIconView: {
    backgroundColor: '#007aff',
    // backgroundColor: '#ffffff',
    // borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 22,
    width: 22,
    height: 22,
    position: 'absolute',
    right: 10,
    bottom: 0,
  },
  selectedIcon: {
    color: '#ffffff',
    fontSize: 18,
    lineHeight: 18,
    margin: 'auto',
    // paddingLeft: 0.5,
  },
});

export default ClothesScreen;
