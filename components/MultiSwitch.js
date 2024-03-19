import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

function MultiSwitch({ data, activeKey }) {
  let { currentKey, setCurrentKey } = useState(activeKey);

  let onPressGroup = (key) => {
    setCurrentKey(key);
  };

  return (
    <View style={styles.sortMenu}>
      {data.map((item) => {
        return (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              onPressGroup(item.key);
            }}>
            <View
              style={item.key == currentKey ? styles.pointActive : styles.point}>
              <Text
                style={[
                  styles.pointText,
                  item.key == currentKey ? styles.pointTextActive : {},
                ]}>
                {item.value}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  sortMenu: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    // zIndex: 2,
  },
  point: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#007aff',
  },
  pointActive: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#007aff',
    borderWidth: 1,
    borderColor: '#007aff',
  },
  pointText: {
    color: '#007aff',
  },
  pointTextActive: {
    color: '#ffffff',
  },
});

export default MultiSwitch;
