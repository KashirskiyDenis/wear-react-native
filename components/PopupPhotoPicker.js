import { useState } from 'react';
import {
  Button,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Entypo } from '@expo/vector-icons';

function PopupPhotoPicker({ label = 'Select image', onSelect }) {
  let [visible, setVisible] = useState(false);

  let toggleModal = () => {
    visible ? setVisible(false) : openModal();
  };

  let openModal = () => {
    setVisible(true);
  };

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
                <Text style={styles.titleModal}>Фото одежды</Text>
                <View style={styles.scrollView}>
                  <TouchableOpacity
                    onPress={() => {
                      onSelect('camera');
                      setVisible(false);
                    }}
                    style={styles.item}>
                    <Entypo name="camera" style={styles.icon} />
                    <Text>Камера</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      onSelect('gallery');
                      setVisible(false);
                    }}
                    style={styles.item}>
                    <Entypo name="images" style={styles.icon} />
                    <Text>Галерея</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </TouchableOpacity>
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
    width: '80%',
  },
  scrollView: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  titleModal: {
    fontSize: 20,
    fontWeight: 600,
    marginBottom: 10,
    paddingLeft: 10,
  },
  item: {
    margin: 1,
  },
  icon: {
    color: '#007aff',
    fontSize: 48,
    marginBottom: 5,
  },
});

export default PopupPhotoPicker;
