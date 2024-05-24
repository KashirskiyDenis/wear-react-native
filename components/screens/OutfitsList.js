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

function OutfitsScreen({ navigation }) {
  const { outfits, deleteOutfitsMany } = useContext(DatabaseContext);
  const { mapImageOutfits } = useContext(VariableContext);

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
    createListOutfits();
  }, [outfits]);

  let createListOutfits = async () => {
    let array = [];
    for (let i = 0; i < outfits.length; i++) {
      array[i] = {
        id: outfits[i].id,
        path: outfits[i].pathToFile,
        uri: mapImageOutfits.get(outfits[i].id),
        season: outfits[i].season,
        event: outfits[i].event,
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
    deleteClothesInOutfit(selected)
      .then(() => {
        deleteOutfit(selected).then(() => {
          setSelected([]);
        });
      })
      .catch((error) => {
        console.error(
          'Component "Outfit". Error when deleting.',
          error.message
        );
        // showSnackbar('Карточка образа не была удалена.', 'error');
      });
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#ffffff',
      }}>
      <FlatList
        data={list}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              if (!isSelect) {
                navigation.navigate('EditOutfitScreen', { ...item });
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
                <Text style={styles.thingTitle}>{item.event}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.addButton}
        onPress={() => navigation.navigate('EditOutfitScreen')}>
        <AddButton />
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
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
    fontSize: 24,
    fontWeight: '600',
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

export default OutfitsScreen;
