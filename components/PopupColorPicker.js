import { useState, useEffect } from 'react';
import {
  Button,
  Dimensions,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');
const widthItem = (width * 0.9 - 20) / 3 - 2;

function PopupColorSelect({ label = 'Select color', onSelect, style }) {
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

  let renderModal = () => {
    if (visible) {
      return (
        <Modal visible={visible} transparent={true} animationType="fade">
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View style={styles.gradient}></View>
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
    backgroundColor: '#0000002a',
  },
  modalView: {
    backgroundColor: '#ffffff',
    padding: 10,
    borderRadius: 7,
    width: '90%',
  },
  gradient: {
    
  }
});

export default PopupColorSelect;
