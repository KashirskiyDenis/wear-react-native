import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { AntDesign, } from '@expo/vector-icons';

function HeaderLeft({ backFunction }) {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={backFunction}>
        <AntDesign name="arrowleft" style={styles.styleElement} />
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

export default HeaderLeft;