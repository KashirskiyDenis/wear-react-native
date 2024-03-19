import { useState, useEffect } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Entypo } from '@expo/vector-icons';

function PopupSelect({ label = 'Select item', data, select, onSelect, style }) {
  let [bigList, setBigList] = useState(false);
  let [visible, setVisible] = useState(false);
  let [selected, setSelected] = useState(
    select?.label ? select.label : undefined
  );

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

  let renderItem = () =>
    data.map((item) => {
      return (
        <TouchableOpacity
          onPress={() => {
            onItemPress(item);
          }}>
          <Text style={[styles.item, style]}>{item.label}</Text>
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
      <View style={[styles.button, style]}>
        <Text style={[styles.buttonText, style]}>{selected || label}</Text>
        <Entypo name="chevron-small-down" style={[styles.buttonText, style, {color: '#007aff'}]} />
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
    width: '50%',
  },
  modalViewBig: {
    height: 220,
  },
  button: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    padding: 5,
    marginVertical: 5,
    borderLeftWidth: 1,
  },
  item: {
    paddingVertical: 7,
  },
});

export default PopupSelect;
