import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import { useAppContext } from '../../AppContext';

function ClothesScreen() {
  const { db } = useAppContext();

  useEffect(() => {
    // console.log('Clothes screen load');
    db.transaction((tx) => {
      tx.executeSql('SELECT * FROM clothes;', [], (_, { rows }) => {
        for (let i = 0; i < rows.length; i++) {
         // console.log(rows.item(i));
        }
      });
    });
  }, [db]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#ffffff',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Text>Clothes!</Text>
    </View>
  );
}

export default ClothesScreen;
