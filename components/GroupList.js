import { Text, View } from 'react-native';

function SortList({ data }) {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
      {data.map((item, index) => {
        return (
          <View
            style={{
              flexDirection: 'row',
              marginTop: 5,
              marginRight: 5,
              alignItems: 'center',
            }}>
            <View
              style={{
                height: 16,
                width: 16,
                backgroundColor: item.color,
                borderRadius: 16,
                marginRight: 5,
              }}></View>
            <View>
              <Text style={{ fontSize: 16 }}>Категория {index}</Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

export default SortList;
