import { createContext, useEffect, useState } from 'react';
import * as SQLite from 'expo-sqlite';

import * as createTable from './services/CreateTables';

const db = SQLite.openDatabase('mydb.db');
const DatabaseContext = createContext(db);

function DatabaseProvider({ children }) {
  let [clothes, setClothes] = useState([]);
  let [outfits, setOutfits] = useState([]);

  const createClothes = (pathToFile, title, category, season, color) => {
    let id;
    return new Promise((resolve, reject) => {
      db.transaction(
        (tx) => {
          tx.executeSql(
            'INSERT INTO clothes (title, pathToFile, category, season, color) VALUES (?, ?, ?, ?, ?)',
            [title, pathToFile, category, season, color],
            (_, result) => {
              id = result.insertId;
              readClothes();
            },
            (_, error) => {
              console.error('Error save clothes', error);
            }
          );
        },
        (transactionError) => {
          console.log(transactionError.message);
        },
        () => {
          resolve(id);
        }
      );
    });
  };

  const createOutifts = (pathToFile, season, event) => {
    let id;
    return new Promise((resolve, reject) => {
      db.transaction(
        (tx) => {
          tx.executeSql(
            'INSERT INTO outfits (pathToFile, season, event) VALUES (?, ?, ?)',
            [pathToFile, season, event],
            (_, result) => {
              id = result.insertId;
              readOutfits();
            },
            (_, error) => {
              console.error('Error save outfits', error);
            }
          );
        },
        (transactionError) => {
          console.log(transactionError.message);
        },
        () => {
          resolve(id);
        }
      );
    });
  };

  const readClothes = () => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM clothes',
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

  const readOutfits = () => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM outfits',
        [],
        (_, result) => {
          setOutfits(result.rows._array);
        },
        (_, error) => {
          console.error('Error loading outfits', error);
        }
      );
    });
  };

  const updateClothes = (id, title, pathToFile, category, season, color) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          'UPDATE clothes SET title=?, pathToFile=?, category=?, season=?, color=? WHERE id=?',
          [title, pathToFile, category, season, color, id],
          () => {
            readClothes();
          },
          (_, error) => {
            console.error('Error update clothes', error);
          }
        );
      },
      (transactionError) => {
        console.log(transactionError.message);
      }
    );
  };

  const updateOutfits = (id, pathToFile, season, event) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          'UPDATE outfits SET pathToFile=?, season=?, event=? WHERE id=?',
          [pathToFile, season, event, id],
          () => {
            readOutfits();
          },
          (_, error) => {
            console.error('Error update outfits', error);
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
          'DELETE FROM clothes WHERE id = ?',
          [id],
          () => {
            readClothes();
          },
          (_, error) => {
            console.error('Error delete clothes', error);
          }
        );
      },
      (transactionError) => {
        console.log(transactionError.message);
      }
    );
  };

  const deleteOutfits = () => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          'DELETE FROM outfits WHERE id = ?',
          [id],
          () => {
            readOutfits();
          },
          (_, error) => {
            console.error('Error delete outfits', error);
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
      tx.executeSql('DROP TABLE IF EXISTS outfits;');
      tx.executeSql('DROP TABLE IF EXISTS outfitClothes;');

      tx.executeSql(createTable.clothes);
      tx.executeSql(createTable.outfits);
      tx.executeSql(createTable.outfitClothes);
    });

    readClothes();
    readOutfits();
  }, []);

  return (
    <DatabaseContext.Provider
      value={{
        clothes,
        outfits,
        createClothes,
        createOutifts,
        readClothes,
        readOutfits,
        updateClothes,
        updateOutfits,
        deleteClothes,
        deleteOutfits,
      }}>
      {children}
    </DatabaseContext.Provider>
  );
}

export { DatabaseContext, DatabaseProvider };
