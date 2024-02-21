import React, { createContext, useEffect, useState, useContext } from 'react';
import * as SQLite from 'expo-sqlite';

import * as createTable from './services/CreateTables';

const db = SQLite.openDatabase('mydb.db');
const DatabaseContext = createContext(db);

function DatabaseProvider({ children }) {
  let [clothes, setClothes] = useState([]);

  const createClothes = (pathToFile, title, category, season, color) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          'INSERT INTO clothes (title, pathToFile, category, season, color) VALUES (?, ?, ?, ?, ?)',
          [title, pathToFile, category, season, color],
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

  const readClothesById = (id) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM clothes WHERE id=?;',
        [id],
        (_, result) => {
          setClothes(result.rows._array);
        },
        (_, error) => {
          console.error('Error loading clothes', error);
        }
      );
    });
  };

  const updateClothes = (id, title, pathToFile, category, season, color) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          'UPDATE clothes SET title=? AND pathToFile=? AND category=? AND season=? AND color=? WHERE id=?',
          [title, pathToFile, category, season, color, id],
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

  const deleteClothes = () => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          'DELETE FROM;',
          [],
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

  const deleteClothesById = (id) => {
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
