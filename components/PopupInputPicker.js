import { useState, useEffect } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Entypo, Feather } from '@expo/vector-icons';

function PopupInputPicker({
  label = 'Select item',
  data,
  select,
  onSelect,
  fontSize,
}) {
  let [bigList, setBigList] = useState(false);
  let [visible, setVisible] = useState(false);
  let [selected, setSelected] = useState(
    select?.label ? select.label : undefined
  );
  let [filterData, setFilterData] = useState(data);

  useEffect(() => {
    if (data.length > 4) setBigList(true);
    if (select) onSelect(select.value);
  }, []);

  let toggleModal = () => {
    visible ? setVisible(false) : openModal();
  };

  let openModal = () => {
    setVisible(true);
  };

  let onItemPress = (item) => {
    setSelected(item.label);
    onSelect(item.value);
    setVisible(false);
  };

  let filter = (text) => {
    if (text)
      setFilterData(filterData.filter((item) => item.label.includes(text)));
    else setFilterData(data);
  };

  let renderItem = () =>
    filterData.map((item) => {
      return (
        <TouchableOpacity
          onPress={() => {
            onItemPress(item);
          }}>
          <Text style={[styles.item, { fontSize: fontSize }]}>
            {item.label}
          </Text>
        </TouchableOpacity>
      );
    });

  let renderModal = () => {
    if (visible) {
      return (
        <Modal visible={visible} transparent={true} animationType="fade">
          <View style={styles.centeredView}>
            <View
              style={[styles.modalView, bigList ? styles.modalViewBig : {}]}>
              <View style={styles.button}>
                <TextInput
                  style={styles.textInput}
                  placeholder="Введите название"
                  placeholderTextColor="#8E8E93"
                  onChangeText={(text) => filter(text)}
                />
                <Feather
                  name="search"
                  style={{ color: '#007aff', fontSize: fontSize }}
                />
              </View>
              <ScrollView>{renderItem()}</ScrollView>
            </View>
          </View>
        </Modal>
      );
    }
  };

  return (
    <TouchableOpacity onPress={toggleModal}>
      {renderModal()}
      <View style={styles.button}>
        <Text style={{ fontSize: fontSize }}>{selected || label}</Text>
        <Entypo
          name="chevron-small-down"
          style={{ color: '#007aff', fontSize: fontSize }}
        />
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
  },
  modalViewBig: {
    maxHeight: 255,
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
  },
  textInput: {
    fontSize: 20,
  },
  item: {
    paddingVertical: 7,
  },
});

export default PopupInputPicker;
