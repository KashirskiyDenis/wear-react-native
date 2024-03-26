import { createContext, useEffect, useState } from 'react';
import * as SQLite from 'expo-sqlite';

import * as createTable from './resources/CreateTables';

const db = SQLite.openDatabase('mydb.db');
const DatabaseContext = createContext(db);

function DatabaseProvider({ children }) {
  let [clothes, setClothes] = useState([]);
  let [outfits, setOutfits] = useState([]);
  let [clothesInOutfit, setClothesInOutfit] = useState([]);

  let createClothes = (pathToFile, type, category, season, color) => {
    let id;
    return new Promise((resolve, reject) => {
      db.transaction(
        (tx) => {
          tx.executeSql(
            'INSERT INTO clothes (type, pathToFile, category, season, color) VALUES (?, ?, ?, ?, ?)',
            [type, pathToFile, category, season, color],
            (_, result) => {
              id = result.insertId;
              readClothes();
              resolve(id);
            },
            (_, error) => {
              console.error('DBContext. Error save clothes.', error.message);
              reject(error);
            }
          );
        },
        (transactionError) => {
          console.error(
            'DBContext. Translation Error create clothes.',
            transactionError.message
          );
          reject(transactionError);
        }
      );
    });
  };

  let createOutift = (pathToFile, season, event) => {
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
              resolve(id);
            },
            (_, error) => {
              console.error('DBContext. Error save outfit.', error.message);
              reject(error);
            }
          );
        },
        (transactionError) => {
          console.error(
            'DBContext. Translation Error create outfit.',
            transactionError.message
          );
          reject(error);
        }
      );
    });
  };

  let createClothesInOutfit = (
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
              resolve(id);
            },
            (_, error) => {
              console.error(
                'DBContext. Error save clothesInOutfit.',
                error.message
              );
              reject(error);
            }
          );
        },
        (transactionError) => {
          console.error(
            'DBContext. Translation Error create clothesInOutfit.',
            transactionError.message
          );
          reject(transactionError);
        }
      );
    });
  };

  let readClothes = () => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM clothes',
        [],
        (_, result) => {
          setClothes(result.rows._array);
        },
        (_, error) => {
          console.error('DBContext. Error loading clothes.', error.message);
        }
      );
    });
  };

  let readClothesGroupBy = (groupBy) => {
    return new Promise((resolve, reject) => {
      db.transaction(
        (tx) => {
          tx.executeSql(
            'SELECT *, count(*) as count FROM clothes GROUP BY ' + groupBy,
            [],
            (_, result) => {
              resolve(result.rows._array);
            },
            (_, error) => {
              console.error('DBContext. Error loading clothes.', error.message);
              reject(error);
            }
          );
        },
        (transactionError) => {
          console.error(
            'DBContext. Translation Error create clothesInOutfit.',
            transactionError.message
          );
          reject(transactionError);
        }
      );
    });
  };

  let readOutfits = () => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM outfits',
        [],
        (_, result) => {
          setOutfits(result.rows._array);
        },
        (_, error) => {
          console.error('DBContext. Error loading outfit.', error.message);
        }
      );
    });
  };

  let readClothesInOutfit = (idOutfit) => {
    let sql = `SELECT cio.idClothes, cio.x, cio.y, cio.width, cio.height, cio.transform, clothes.pathToFile
          FROM clothes, clothesInOutfit AS cio
          WHERE clothes.id = cio.idClothes AND
            cio.idOutfit = ?`;
    return new Promise((resolve, reject) => {
      db.transaction(
        (tx) => {
          tx.executeSql(
            sql,
            [idOutfit],
            (_, result) => {
              setClothesInOutfit(result.rows._array);
              resolve(result.rows._array);
            },
            (_, error) => {
              console.error(
                'DBContext. Error reading clothes in outfit.',
                error.message
              );
              reject(error);
            }
          );
        },
        (transactionError) => {
          console.error(
            'DBContext. Translation Error reading clothes in outfit.',
            transactionError.message
          );
          reject(transactionError);
        }
      );
    });
  };

  let updateClothes = (id, type, pathToFile, category, season, color) => {
    return new Promise((resolve, reject) => {
      db.transaction(
        (tx) => {
          tx.executeSql(
            'UPDATE clothes SET type=?, pathToFile=?, category=?, season=?, color=? WHERE id=?',
            [type, pathToFile, category, season, color, id],
            () => {
              readClothes();
              resolve();
            },
            (_, error) => {
              console.error('DBContext. Error update clothes.', error.message);
              reject(error);
            }
          );
        },
        (transactionError) => {
          console.error(
            'DBContext. Translation Error update clothes.',
            transactionError.message
          );
          reject(transactionError);
        }
      );
    });
  };

  let updateOutfit = (id, pathToFile, season, event) => {
    return new Promise((resolve, reject) => {
      db.transaction(
        (tx) => {
          tx.executeSql(
            'UPDATE outfits SET pathToFile=?, season=?, event=? WHERE id=?',
            [pathToFile, season, event, id],
            () => {
              readOutfits();
              resolve();
            },
            (_, error) => {
              console.error('DBContext. Error update outfits.', error.message);
              reject(error);
            }
          );
        },
        (transactionError) => {
          console.error(
            'DBContext. Translation Error update outfit.',
            transactionError.message
          );
          reject(transactionError);
        }
      );
    });
  };

  let deleteClothes = (id) => {
    return new Promise((resolve, reject) => {
      db.transaction(
        (tx) => {
          tx.executeSql(
            'DELETE FROM clothes WHERE id = ?',
            [id],
            () => {
              readClothes();
              resolve();
            },
            (_, error) => {
              console.error(
                'DBContext. Error delete clothes SQL.',
                error.message
              );
              reject(error);
            }
          );
        },
        (transactionError) => {
          console.error(
            'DBContext. Translation Error delete clothes.',
            transactionError.message
          );
          reject(transactionError);
        }
      );
    });
  };

  let deleteOutfit = (id) => {
    return new Promise((resolve, reject) => {
      db.transaction(
        (tx) => {
          tx.executeSql(
            'DELETE FROM outfits WHERE id = ?',
            [id],
            () => {
              readOutfits();
              resolve();
            },
            (_, error) => {
              console.error('DBContext. Error delete outfit.', error.message);
              reject(error);
            }
          );
        },
        (transactionError) => {
          console.error(
            'DBContext. Translation Error delete outfit.',
            transactionError.message
          );
          reject(transactionError);
        }
      );
    });
  };

  let deleteClothesInOutfit = (id) => {
    return new Promise((resolve, reject) => {
      db.transaction(
        (tx) => {
          tx.executeSql(
            'DELETE FROM clothesInOutfit WHERE idOutfit = ?',
            [id],
            () => {
              resolve();
            },
            (_, error) => {
              console.error(
                'DBContext. Error delete clothesInOutfit.',
                error.message
              );
              reject(error);
            }
          );
        },
        (transactionError) => {
          console.error(
            'DBContext. Translation Error delete clothesInOutfit.',
            transactionError.message
          );
          reject(transactionError);
        }
      );
    });
  };

  let createNecessaryTables = () => {
    db.exec([{ sql: 'PRAGMA foreign_keys = ON;', args: [] }], false, () => {});
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
        createOutift,
        createClothesInOutfit,

        readClothes,
        readOutfits,
        readClothesInOutfit,
        readClothesGroupBy,

        updateClothes,
        updateOutfit,

        deleteClothes,
        deleteOutfit,
        deleteClothesInOutfit,
      }}>
      {children}
    </DatabaseContext.Provider>
  );
}

export { DatabaseContext, DatabaseProvider };
