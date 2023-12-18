import React, { createContext, useEffect, useState, useContext } from 'react';
import * as SQLite from 'expo-sqlite';

import * as createTable from './services/CreateTables';

const db = SQLite.openDatabase('mydb.db');
const DatabaseContext = createContext(db);

function DatabaseProvider({ children }) {
  let [clothes, setClothes] = useState([]);

  const readClothes = () => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM clothes;',
        [],
        (_, result) => {
          setClothes(result.rows._array);
        },
        (_, error) => {
          console.error('Error loading clothes', error);
        }
      );
    });
  };

  const createClothes = (pathToFile, category, season, color) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          'INSERT INTO clothes (pathToFile, category, season, color) VALUES (?, ?, ?, ?)',
          [pathToFile, category, season, color],
          () => {
            readClothes();
          },
          (_, error) => {
            console.error('Error save clothes', error);
          }
        );
      },
      (transactionError) => {
        console.log(transactionError.message);
      }
    );
  };

  const updateClothes = (pathToFile, category, season, color) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          'UPDATE clothes SET pathToFile=? AND category=? AND season=? AND color=? WHERE id=?',
          [pathToFile, category, season, color, id],
          () => {
            readClothes();
          },
          (_, error) => {
            console.error('Error change clothes', error);
          }
        );
      },
      (transactionError) => {
        console.log(transactionError.message);
      }
    );
  };

  const deleteClothes = (id) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          'DELETE FROM WHERE id=?',
          [id],
          () => {
            readClothes();
          },
          (_, error) => {
            console.error('Error change clothes', error);
          }
        );
      },
      (transactionError) => {
        console.log(transactionError.message);
      }
    );
  };

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql('DROP TABLE IF EXISTS clothes;');
      tx.executeSql('DROP TABLE IF EXISTS outfit;');
      tx.executeSql('DROP TABLE IF EXISTS outfit_clothes;');

      tx.executeSql(createTable.clothes);
      tx.executeSql(createTable.outfit);
      tx.executeSql(createTable.outfit_clothes);
    });

    db.transaction((tx) => {
      tx.executeSql(
        'INSERT INTO clothes (pathToFile, category, season, color) VALUES (?, ?, ?, ?);',
        ['pathToFile1', 'category1', 'season1', 'color1']
      );
      tx.executeSql(
        'INSERT INTO clothes (pathToFile, category, season, color) VALUES (?, ?, ?, ?);',
        ['pathToFile2', 'category2', 'season2', 'color2']
      );
    });
    readClothes();
  }, []);

  return (
    <DatabaseContext.Provider
      value={{
        clothes,
        createClothes,
        readClothes,
        updateClothes,
        deleteClothes,
      }}>
      {children}
    </DatabaseContext.Provider>
  );
}

export { DatabaseContext, DatabaseProvider };
