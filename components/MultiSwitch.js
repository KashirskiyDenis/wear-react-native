import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

function MultiSwitch({ data, activeKey, onChange }) {
  let [currentKey, setCurrentKey] = useState(activeKey);

  let onPressGroup = (key) => {
    setCurrentKey(key);
    onChange(key);
  };

  return (
    <View style={styles.sortMenu}>
      {data.map((item, index) => {
        return (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              onPressGroup(item.key);
            }}>
            <View
              style={[
                item.key == currentKey ? styles.pointActive : styles.point,
                index == data.length - 1 ? styles.pointLast : {},
              ]}>
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
  },
  point: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#ffffff',
    borderLeftWidth: 1,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#007aff',
  },
  pointLast: {
    borderRightWidth: 1,
  },
  pointActive: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#007aff',
    borderLeftWidth: 1,
    borderTopWidth: 1,
    borderBottomWidth: 1,
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
