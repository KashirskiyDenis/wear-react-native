import { createContext, useEffect, useState } from 'react';
import * as SQLite from 'expo-sqlite';

import * as createTable from './services/CreateTables';

const db = SQLite.openDatabase('mydb.db');
const DatabaseContext = createContext(db);

function DatabaseProvider({ children }) {
  let [clothes, setClothes] = useState([]);
  let [outfits, setOutfits] = useState([]);
  let [clothesInOutfit, setClothesInOutfit] = useState([]);

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
              console.error('Error save outfit', error);
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

  const createClothesInOutfit = (
    idOutfit,
    idClothes,
    x,
    y,
    width,
    height,
    transform
  ) => {
    let id;
    return new Promise((resolve, reject) => {
      db.transaction(
        (tx) => {
          tx.executeSql(
            'INSERT INTO clothesInOutfit (idOutfit, idClothes, x, y, width, height, transform) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [idOutfit, idClothes, x, y, width, height, transform],
            (_, result) => {
              id = result.insertId;
            },
            (_, error) => {
              console.error('Error save clothesInOutfit', error);
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
          console.error('Error loading outfit', error);
        }
      );
    });
  };

  const readClothesInOutfit = (idOutfit) => {
    // let sql = `SELECT cio.id, cio.x, cio.y, cio.width, cio.height, cio.transform, clothes.pathToFile
    //       FROM clothes, clothesInOutfit AS cio
    //       WHERE clothes.id = cio.idClothes AND
    //         cio.idOutfit = ?`;
    let sql = `SELECT cio.id, cio.idOutfit, cio.idClothes, cio.x, cio.y, cio.width, cio.height, cio.transform, clothes.pathToFile
          FROM clothes, clothesInOutfit AS cio
          WHERE clothes.id = cio.idClothes AND cio.idOutfit = ?`;
    db.transaction((tx) => {
      tx.executeSql(
        sql,
        [idOutfit],
        (_, result) => {
          console.log(
            `SELECT * FROM clothesInOutfit WHERE idOutfit = ${idOutfit}`
          );
          console.log(result.rows._array);
          // setClothesInOutfit(result.rows._array);
        },
        (_, error) => {
          console.error('Error loading clothes', error);
        }
      );
    });
  };


  const readClothesInOutfitAll = () => {
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM clothesInOutfit AS cio`,
        [],
        (_, result) => {
          console.log(`SELECT * FROM clothesInOutfit AS cio`);
          console.log(result.rows._array);
        },
        (_, error) => {
          console.error('Error loading clothes', error);
        }
      );
    });
  };

  const readClothesInOutfitAllWhere2 = () => {
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM clothesInOutfit AS cio WHERE idOutfit = 2`,
        [],
        (_, result) => {
          console.log(`SELECT * FROM clothesInOutfit AS cio WHERE idOutfit = 2`);
          console.log(result.rows._array);
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

  let createNecessaryTables = () => {
    db.transaction((tx) => {
      tx.executeSql('DROP TABLE IF EXISTS clothes;');
      tx.executeSql('DROP TABLE IF EXISTS outfits;');
      tx.executeSql('DROP TABLE IF EXISTS clothesInOutfit;');

      tx.executeSql(createTable.clothes);
      tx.executeSql(createTable.outfits);
      tx.executeSql(createTable.clothesInOutfit);
    });
  };

  useEffect(() => {
    createNecessaryTables();

    readClothes();
    readOutfits();
  }, []);

  return (
    <DatabaseContext.Provider
      value={{
        clothes,
        outfits,
        clothesInOutfit,
        createClothes,
        createOutifts,
        createClothesInOutfit,
        readClothes,
        readOutfits,
        readClothesInOutfit,
        readClothesInOutfitAll,
        readClothesInOutfitAllWhere2,
        updateClothes,
        updateOutfits,
        // updateClothesInOutfit,
        deleteClothes,
        deleteOutfits,
      }}>
      {children}
    </DatabaseContext.Provider>
  );
}

export { DatabaseContext, DatabaseProvider };
