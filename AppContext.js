import React, { createContext, useContext } from 'react';
import * as SQLite from 'expo-sqlite';

import * as createTable from './services/CreateTables';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const db = SQLite.openDatabase('mydb.db');

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

  return <AppContext.Provider value={{ db }}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  return useContext(AppContext);
};
