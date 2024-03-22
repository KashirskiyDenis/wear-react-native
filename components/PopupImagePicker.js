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
          }}
          style={styles.item}>
          <Image
            style={styles.itemImage}
            source={{ uri: 'data:image/png;base64,' + item.value }}
          />
        </TouchableOpacity>
      );
    });

  let renderModal = () => {
    if (visible) {
      return (
        <Modal visible={visible} transparent={true} animationType="fade">
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <ScrollView>
                <View style={styles.scrollView}>{renderItem()}</View>
              </ScrollView>
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
  scrollView: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  item: {
    margin: 1,
    width: widthItem,
  },
  itemImage: {
    width: widthItem,
    height: widthItem,
    resizeMode: 'cover',
  },
});

export default PopupImageSelect;
