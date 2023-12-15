import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useAppContext } from '../../AppContext';

function ClothesScreen() {
  const { db } = useAppContext();
  const [clothes, setClothes] = useState({});

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql('SELECT * FROM clothes;', [], (_, { rows }) => {
        setClothes(rows._array);
      });
    });
  }, [db]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#ffffff',
      }}>
      <FlatList
        data={clothes}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>{item.pathToFile}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
});

export default ClothesScreen;
