import { useState, useEffect } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
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
  let [visible, setVisible] = useState(false);
  let [selected, setSelected] = useState(
    select?.label ? select.label : undefined
  );
  let [filterData, setFilterData] = useState(data);
  let [text, setText] = useState('');

  useEffect(() => {
    if (select) onSelect(select.value);
  }, []);

  useEffect(() => {
    if (text)
      setFilterData(filterData.filter((item) => item.label.includes(text)));
    else setFilterData(data);
  }, [text]);

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
        <Modal
          visible={visible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => {
            setVisible(false);
          }}>
          <TouchableOpacity
            onPress={() => {
              setText('');
              setVisible(false);
            }}
            style={styles.centeredView}>
            <TouchableWithoutFeedback>
              <View style={styles.modalView}>
                <View style={styles.button}>
                  <TextInput
                    style={{ fontSize: fontSize }}
                    placeholder="Введите название"
                    placeholderTextColor="#8E8E93"
                    value={text}
                    onChangeText={setText}
                  />
                  <Feather
                    name="search"
                    style={{ color: '#007aff', fontSize: fontSize }}
                  />
                </View>
                <ScrollView>{renderItem()}</ScrollView>
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
        <Text
          style={[
            { fontSize: fontSize },
            selected ? {} : styles.placeholderTextColor,
          ]}>
          {selected || label}
        </Text>
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
    borderLeftColor: '#007aff',
  },
  item: {
    paddingVertical: 7,
  },
  placeholderTextColor: {
    color: '#8e8e93',
  },
});

export default PopupInputPicker;
