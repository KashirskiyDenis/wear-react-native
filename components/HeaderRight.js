import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

function HeaderRight({ removeFunction }) {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={removeFunction}>
        <Feather name="trash-2" style={styles.styleElement} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    paddingLeft: 16,
    alignItems: 'center',
    // justifyContent: 'space-between',
  },
  styleElement: {
    fontSize: 20,
    color: '#007aff',
  },
});

export default HeaderRight;
