import { StyleSheet, Text, View } from 'react-native';

function GroupList({ data }) {
  return (
    <View style={styles.container}>
      {data.map((item) => {
        return (
          <View style={styles.item}>
            <View
              style={[styles.circle, { backgroundColor: item.color }]}></View>
            <View>
              <Text style={styles.text}>
                {item.title} - {item.count}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  item: {
    flexDirection: 'row',
    marginBottom: 5,
    marginRight: 5,
    alignItems: 'center',
  },
  circle: {
    height: 16,
    width: 16,
    borderRadius: 16,
    marginRight: 5,
  },
  text: {
    fontSize: 16,
  },
});

export default GroupList;
