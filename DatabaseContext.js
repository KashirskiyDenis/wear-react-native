import { createContext, useEffect, useState } from 'react';
import * as SQLite from 'expo-sqlite';

import * as createTable from './services/CreateTables';

const db = SQLite.openDatabase('mydb.db');
const DatabaseContext = createContext(db);

function DatabaseProvider({ children }) {
  let [clothes, setClothes] = useState([]);
  let [outfits, setOutfits] = useState([]);
  let [clothesInOutfit, setClothesInOutfit] = useState([]);

  let createClothes = (pathToFile, title, category, season, color) => {
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
              console.error('DBContext. Error save clothes. ', error.message);
            }
          );
        },
        (transactionError) => {
          console.error(
            'DBContext. Translation Error create clothes.',
            transactionError.message
          );
        },
        () => {
          resolve(id);
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
            },
            (_, error) => {
              console.error('DBContext. Error save outfit. ', error.message);
            }
          );
        },
        (transactionError) => {
          console.error(
            'DBContext. Translation Error create outfit.',
            transactionError.message
          );
        },
        () => {
          resolve(id);
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
            },
            (_, error) => {
              console.error(
                'DBContext. Error save clothesInOutfit. ',
                error.message
              );
            }
          );
        },
        (transactionError) => {
          console.error(
            'DBContext. Translation Error create clothesInOutfit.',
            transactionError.message
          );
        },
        () => {
          resolve(id);
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
          console.error('DBContext. Error loading clothes. ', error.message);
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
          console.error('DBContext. Error loading outfit. ', error.message);
        }
      );
    });
  };

  let readClothesInOutfitAll = () => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM clothesInOutfit',
        [],
        (_, result) => {
          console.log(result.rows._array);
        },
        (_, error) => {
          console.error('DBContext. Error loading outfit. ', error.message);
        }
      );
    });
  };

  let readClothesInOutfit = (idOutfit) => {
    let sql = `SELECT cio.id, cio.x, cio.y, cio.width, cio.height, cio.transform, clothes.pathToFile
          FROM clothes, clothesInOutfit AS cio
          WHERE clothes.id = cio.idClothes AND
            cio.idOutfit = ?`;
    db.transaction((tx) => {
      tx.executeSql(
        sql,
        [idOutfit],
        (_, result) => {
          console.log(result.rows._array);
        },
        (_, error) => {
          console.error('DBContext. Error loading clothes. ', error.message);
        }
      );
    });
  };

  let updateClothes = (id, title, pathToFile, category, season, color) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          'UPDATE clothes SET title=?, pathToFile=?, category=?, season=?, color=? WHERE id=?',
          [title, pathToFile, category, season, color, id],
          () => {
            readClothes();
          },
          (_, error) => {
            console.error('DBContext. Error update clothes. ', error.message);
          }
        );
      },
      (transactionError) => {
        console.error(
          'DBContext. Translation Error update clothes.',
          transactionError.message
        );
      }
    );
  };

  let updateOutfit = (id, pathToFile, season, event) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          'UPDATE outfits SET pathToFile=?, season=?, event=? WHERE id=?',
          [pathToFile, season, event, id],
          () => {
            readOutfits();
          },
          (_, error) => {
            console.error('DBContext. Error update outfits. ', error.message);
          }
        );
      },
      (transactionError) => {
        console.error(
          'DBContext. Translation Error update outfit.',
          transactionError.message
        );
      }
    );
  };

  let deleteClothes = (id) => {
    return new Promise((resolve, reject) => {
      db.transaction(
        (tx) => {
          tx.executeSql(
            'DELETE FROM clothes WHERE id = ?',
            [id],
            (_, result) => {
              if (result.rowsAffected > 0) {
                readClothes();
              }
            },
            (_, error) => {
              console.error(
                'DBContext. Error delete clothes SQL.',
                error.message
              );
              reject('DBContext. Error delete clothes SQL. ' + error.message);
            }
          );
        },
        (transactionError) => {
          console.error(
            'DBContext. Translation Error delete clothes.',
            transactionError.message
          );
          reject(
            'DBContext. Translation Error delete clothes.' +
              transactionError.message
          );
        },
        () => {
          resolve();
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
              if (result.rowsAffected > 0) {
                readOutfits();
                deleteClothesInOutfit(id).catch((error) => reject(error));
              }
            },
            (_, error) => {
              console.error('DBContext. Error delete outfit. ', error.message);
              reject('DBContext. Error delete outfit SQL. ' + error.message);
            }
          );
        },
        (transactionError) => {
          console.error(
            'DBContext. Translation Error delete outfit.',
            transactionError.message
          );
          reject(
            'DBContext. Translation Error delete outfit.' +
              transactionError.message
          );
        },
        () => {
          readClothesInOutfitAll();
          resolve();
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
            () => {},
            (_, error) => {
              console.error(
                'DBContext. Error delete clothesInOutfit. ',
                error.message
              );
              reject(
                'DBContext. Error delete clothesInOutfit SQL. ' + error.message
              );
            }
          );
        },
        (transactionError) => {
          console.error(
            'DBContext. Translation Error delete clothesInOutfit.',
            transactionError.message
          );
          reject(
            'DBContext. Translation Error delete clothesInOutfit.' +
              transactionError.message
          );
        },
        () => {
          resolve();
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
