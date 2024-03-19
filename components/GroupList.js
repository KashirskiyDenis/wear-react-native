import { Text, View } from 'react-native';

function SortList({ data, colors }) {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
      {colors.map((color, index) => {
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
                backgroundColor: color,
                borderRadius: 16,
                marginRight: 5,
                opacity: 0.5,
              }}></View>
            <View>
              <Text style={{fontSize: 16,}}>Категория {index}</Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

export default SortList;
