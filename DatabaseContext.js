import { createContext, useEffect, useState } from 'react';
import * as SQLite from 'expo-sqlite';

import * as createTable from './resources/CreateTables';

const ALLOWED_GROUP_FIELDS = ['type', 'category', 'season', 'color'];

const ERROR_MESSAGES = {
  saveClothes: 'Error save clothes.',
  saveOutfit: 'Error save outfit.',
  saveClothesInOutfit: 'Error save clothesInOutfit.',
  loadClothes: 'Error loading clothes.',
  loadOutfit: 'Error loading outfit.',
  readClothesInOutfit: 'Error reading clothes in outfit.',
  updateClothes: 'Error update clothes.',
  updateOutfit: 'Error update outfits.',
  deleteClothes: 'Error delete clothes SQL.',
  deleteOutfit: 'Error delete outfit.',
  deleteClothesInOutfit: 'Error delete clothesInOutfit.',
  initDb: 'Error initializing database.',
};

const SQL_QUERIES = {
  insertClothes:
    'INSERT INTO clothes (type, pathToFile, category, season, color, width, height) VALUES (?, ?, ?, ?, ?, ?, ?)',
  insertOutfit:
    'INSERT INTO outfits (pathToFile, season, event) VALUES (?, ?, ?)',
  insertClothesInOutfit:
    'INSERT INTO clothesInOutfit (idOutfit, idClothes, x, y, width, height, transform) VALUES (?, ?, ?, ?, ?, ?, ?)',
  selectAllClothes: 'SELECT * FROM clothes',
  selectAllOutfits: 'SELECT * FROM outfits',
  selectClothesInOutfit: `
    SELECT cio.id, cio.idClothes, cio.x, cio.y, cio.width, cio.height, cio.transform, clothes.pathToFile
    FROM clothes, clothesInOutfit AS cio
    WHERE clothes.id = cio.idClothes AND cio.idOutfit = ?`,
  updateClothes:
    'UPDATE clothes SET type=?, pathToFile=?, category=?, season=?, color=? WHERE id=?',
  updateOutfit: 'UPDATE outfits SET pathToFile=?, season=?, event=? WHERE id=?',
};

const DatabaseContext = createContext(db);

let withErrorHandling = async (operation, errorKey, shouldThrow = true) => {
  try {
    return await operation();
  } catch (error) {
    console.error(`DBContext. ${ERROR_MESSAGES[errorKey]}`, error.message);
    if (shouldThrow) throw error;
  }
};

const db = SQLite.openDatabaseAsync('mydb');

function DatabaseProvider({ children }) {
  let [clothes, setClothes] = useState([]);
  let [outfits, setOutfits] = useState([]);
  let [clothesInOutfit, setClothesInOutfit] = useState([]);

  let createClothes = async (
    pathToFile,
    type,
    category,
    season,
    color,
    width,
    height
  ) => {
    return withErrorHandling(async () => {
      let result = await db.runAsync(SQL_QUERIES.insertClothes, [
        type,
        pathToFile,
        category,
        season,
        color,
        width,
        height,
      ]);
      await readClothes();
      return result.lastInsertRowId;
    }, 'saveClothes');
  };

  let createOutfit = async (pathToFile, season, event) => {
    return withErrorHandling(async () => {
      let result = await db.runAsync(SQL_QUERIES.insertOutfit, [
        pathToFile,
        season,
        event,
      ]);
      await readOutfits();
      return result.lastInsertRowId;
    }, 'saveOutfit');
  };

  let createClothesInOutfit = async (
    idOutfit,
    idClothes,
    x,
    y,
    width,
    height,
    transform
  ) => {
    return withErrorHandling(async () => {
      let result = await db.runAsync(SQL_QUERIES.insertClothesInOutfit, [
        idOutfit,
        idClothes,
        x,
        y,
        width,
        height,
        transform,
      ]);
      return result.lastInsertRowId;
    }, 'saveClothesInOutfit');
  };

  let readClothes = async () => {
    return withErrorHandling(
      async () => {
        let result = await db.getAllAsync(SQL_QUERIES.selectAllClothes);
        setClothes(result);
        return result;
      },
      'loadClothes',
      false
    );
  };

  let readClothesGroupBy = async (groupBy) => {
    if (!ALLOWED_GROUP_FIELDS.includes(groupBy)) {
      throw new Error(`Invalid groupBy field: ${groupBy}`);
    }

    return withErrorHandling(async () => {
      let result = await db.getAllAsync(
        `SELECT *, count(*) as count FROM clothes GROUP BY ${groupBy}`
      );
      return result;
    }, 'loadClothes');
  };

  let readOutfits = async () => {
    return withErrorHandling(
      async () => {
        let result = await db.getAllAsync(SQL_QUERIES.selectAllOutfits);
        setOutfits(result);
        return result;
      },
      'loadOutfit',
      false
    );
  };

  let readClothesInOutfit = async (idOutfit) => {
    return withErrorHandling(async () => {
      let result = await db.getAllAsync(SQL_QUERIES.selectClothesInOutfit, [
        idOutfit,
      ]);
      setClothesInOutfit(result);
      return result;
    }, 'readClothesInOutfit');
  };

  let updateClothes = async (id, type, pathToFile, category, season, color) => {
    return withErrorHandling(async () => {
      await db.runAsync(SQL_QUERIES.updateClothes, [
        type,
        pathToFile,
        category,
        season,
        color,
        id,
      ]);
      await readClothes();
    }, 'updateClothes');
  };

  let updateOutfit = async (id, pathToFile, season, event) => {
    return withErrorHandling(async () => {
      await db.runAsync(SQL_QUERIES.updateOutfit, [
        pathToFile,
        season,
        event,
        id,
      ]);
      await readOutfits();
    }, 'updateOutfit');
  };

  let deleteClothes = async (ids) => {
    const placeholders = ids.map(() => '?').join(',');

    try {
      await db.runAsync(
        `DELETE FROM clothes WHERE id IN (${placeholders})`,
        ids
      );

      await readClothes();
    } catch (error) {
      console.error('DBContext. Error delete clothes SQL.', error.message);
      throw error;
    }
  };

  let deleteOutfit = async (ids) => {
    const placeholders = ids.map(() => '?').join(',');

    try {
      await db.runAsync(
        `DELETE FROM outfits WHERE id IN (${placeholders})`,
        ids
      );

      await readOutfits();
    } catch (error) {
      console.error('DBContext. Error delete outfit.', error.message);
      throw error;
    }
  };

  let deleteClothesInOutfit = async (ids) => {
    const placeholders = ids.map(() => '?').join(',');

    try {
      await db.runAsync(
        `DELETE FROM clothesInOutfit WHERE idOutfit IN (${placeholders})`,
        ids
      );
    } catch (error) {
      console.error('DBContext. Error delete clothesInOutfit.', error.message);
      throw error;
    }
  };

  let createNecessaryTables = async () => {
    await db.execAsync('PRAGMA foreign_keys = ON;');

    await db.execAsync('DROP TABLE IF EXISTS clothesInOutfit;');
    await db.execAsync('DROP TABLE IF EXISTS outfits;');
    await db.execAsync('DROP TABLE IF EXISTS clothes;');

    await db.execAsync(createTable.clothes);
    await db.execAsync(createTable.outfits);
    await db.execAsync(createTable.clothesInOutfit);
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
        createOutfit,
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
