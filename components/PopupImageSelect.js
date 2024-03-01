import { useState, useEffect } from 'react';
import {
  Button,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

function PopupImageSelect({
  label = 'Select image',
  uriList = [],
  onSelect,
  style,
}) {
  let [visible, setVisible] = useState(false);

  let toggleModal = () => {
    visible ? setVisible(false) : openModal();
  };

  let openModal = () => {
    setVisible(true);
  };

  let onItemPress = (item) => {
    onSelect(item);
    setVisible(false);
  };

  let renderItem = () =>
    uriList.map((item) => {
      return (
        <TouchableOpacity
          onPress={() => {
            onItemPress(item);
          }}>
          <View>
            <Image
              style={styles.item}
              source={{ uri: 'data:image/png;base64,' + item }}
            />
          </View>
        </TouchableOpacity>
      );
    });

  let renderModal = () => {
    if (visible) {
      return (
        <Modal visible={visible} transparent={true} animationType="fade">
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <ScrollView>{renderItem()}</ScrollView>
            </View>
          </View>
        </Modal>
      );
    }
  };

  return (
    <View>
      {renderModal()}
      <View>
        <Button title={label} onPress={toggleModal} />
      </View>
    </View>
  );
}

let styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0000001a',
  },
  modalView: {
    backgroundColor: '#ffffffde',
    padding: 10,
    borderRadius: 7,
    width: '90%',
  },
  button: {},
  item: {
    width: '33%',
    height: 150,
    resizeMode: 'cover',
  },
});

export default PopupImageSelect;
