import { useState } from 'react';
import {
  Button,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

function PopupChoicePicker({
  label = 'Select image',
  icons = [],
  labels = [],
  functions = [],
}) {
  let [visible, setVisible] = useState(false);

  let toggleModal = () => {
    visible ? setVisible(false) : openModal();
  };

  let openModal = () => {
    setVisible(true);
  };

  let renderItem = () => {
    return icons.map((item, index) => {
      return (
        <TouchableOpacity
          onPress={() => {
            functions[index]();
            setVisible(false);
          }}
          style={styles.item}>
          <Image source={item} style={styles.itemImage} />
          <Text>{labels[index]}</Text>
        </TouchableOpacity>
      );
    });
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
                <View style={styles.scrollView}>{renderItem()}</View>
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
  itemImage: {
    width: 50,
    height: 50,
    resizeMode: 'cover',
  },
});

export default PopupChoicePicker;
