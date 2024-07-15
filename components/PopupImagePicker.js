import { useState } from 'react';
import {
  Button,
  Dimensions,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');
const widthItem = (width * 0.8 - 20) / 3 - 2;

function PopupImageSelect({ label = 'Select image', uriList = [], onSelect }) {
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

  let renderItem = () => {
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
  };

  let renderNoImageMessage = () => {
    return <Text>У Вас нет картинок для выбора</Text>;
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
                <ScrollView>
                  <View style={styles.scrollView}>
                    {uriList.length
                      ? uriList.map((item) => {
                          return (
                            <TouchableOpacity
                              onPress={() => {
                                onItemPress(item);
                              }}
                              style={styles.item}>
                              <Image
                                style={styles.itemImage}
                                source={{
                                  uri: 'data:image/png;base64,' + item.value,
                                }}
                              />
                            </TouchableOpacity>
                          );
                        })
                      : renderNoImageMessage()}
                  </View>
                </ScrollView>
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
    maxHeight: width * 0.8,
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
