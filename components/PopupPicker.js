import { useState, useEffect } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Entypo } from '@expo/vector-icons';

function PopupSelect({
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

  useEffect(() => {
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
              setVisible(false);
            }}
            style={styles.centeredView}>
            <TouchableWithoutFeedback>
              <View style={styles.modalView}>
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

export default PopupSelect;
