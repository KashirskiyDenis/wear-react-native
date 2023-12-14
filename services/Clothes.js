export const createClothes = (db, clothes) => {
  db.transaction(
    (tx) => {
      tx.executeSql(
        'INSERT INTO clothes (pathToFile, category, season, color) VALUES (?, ?, ?, ?)',
        clothes,
        (result) => {
          console.log(result);
        },
        (executeSqlError) => {
          console.log(executeSqlError.message);
        }
      );
    },
    (transactionError) => {
      console.log(transactionError.message);
    }
  );
};

export const readClothes = (db, id) => {
  db.transaction(
    (tx) => {
      tx.executeSql(
        'SELECT * FROM clothes WHERE id=?',
        id,
        (result) => {
          for (let item of result) {
            console.log(item);
          }
        },
        (executeSqlError) => {
          console.log(executeSqlError.message);
        }
      );
    },
    (transactionError) => {
      console.log(transactionError.message);
    }
  );
};

export const updateClothes = (db, clothes) => {};

export const deleteClothes = (db, id) => {};
