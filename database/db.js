import {openDatabase} from 'react-native-sqlite-storage';

var db = openDatabase({name: 'attendance.db'});
var tableName = 'attendanceList';
//method returns a Promise - in the calling side .then(...).then(...)....catch(...) can be used

// Initialize the database
export const init = () => {
  const promise = new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql('DROP TABLE IF EXISTS ' + tableName, [], () => {
        console.log('Table dropped');
      }); //uncomment this if needed - sometimes it is good to empty the table
      //By default, primary key is auto_incremented - we do not add anything to that column
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS ${tableName} (
          id INTEGER PRIMARY KEY NOT NULL, 
          name TEXT NOT NULL, 
          age INTEGER NOT NULL, 
          flag TEXT DEFAULT 'Not archived'
        );`,
        [], //second parameters of execution:empty square brackets - this parameter is not needed when creating table
        //If the transaction succeeds, this is called
        () => {
          // Verify table structure
          tx.executeSql(`PRAGMA table_info(${tableName});`, [], (_, {rows}) => {
            console.log('Table structure:', rows);
          });
          resolve(); //There is no need to return anything
        },
        //If the transaction fails, this is called
        (_, err) => {
          reject(err);
        },
      );
    });
  });
  return promise;
};

// Add a person
export const addPerson = (name, age) => {
  const promise = new Promise((resolve, reject) => {
    db.transaction(tx => {
      //Here we use the Prepared statement, just putting placeholders to the values to be inserted
      tx.executeSql(
        'insert into ' + tableName + '(name, age) values(?,?);',
        //And the values come here
        [name, age],
        //If the transaction succeeds, this is called
        (_, result) => {
          console.log('Added person:', result);
          resolve(result);
        },
        //If the transaction fails, this is called
        (_, err) => {
          console.error('Failed to add person:', err);
          reject(err);
        },
      );
    });
  });
  return promise;
};

// Update a person
export const updatePerson = (id, name, age) => {
  const promise = new Promise((resolve, reject) => {
    db.transaction(tx => {
      //Here we use the Prepared statement, just putting placeholders to the values to be inserted
      tx.executeSql(
        'update ' + tableName + ' set name=?, age=? where id=?',
        //And the values come here
        [name, age, id],
        //If the transaction succeeds, this is called
        (_, result) => {
          console.log('Updated person:', result);
          resolve(result);
          //If the transaction fails, this is called
          (_, err) => {
            console.error('Failed to update person:', err);
            reject(err);
          };
        },
      );
    });
  });
  return promise;
};

// Archive a person
export const archivePerson = id => {
  console.log('Archiving person with ID:', id);
  const promise = new Promise((resolve, reject) => {
    db.transaction(tx => {
      //Here we use the Prepared statement, just putting placeholders to the values to be inserted
      tx.executeSql(
        `UPDATE ${tableName} SET flag = ? WHERE id = ?`,
        //And the values come here
        ['Archived', id],
        //If the transaction succeeds, this is called
        (_, result) => {
          if (result.rowsAffected > 0) {
            console.log('Archived person:', result);
            console.log('Person archived successfully with ID:', id);
            resolve(result);
          } else {
            reject(new Error('No person found with the given ID'));
          }
        },
        //If the transaction fails, this is called
        (_, err) => {
          console.error('Failed to execute SQL:', err);
          reject(err);
        },
      );
    });
  });
  return promise;
};

// Delete a person
export const deletePerson = id => {
  const promise = new Promise((resolve, reject) => {
    db.transaction(tx => {
      //Here we use the Prepared statement, just putting placeholders to the values to be inserted
      tx.executeSql(
        'delete from ' + tableName + ' where id=?',
        //And the values come here
        [id],
        //If the transaction succeeds, this is called
        (_, result) => {
          console.log('Deleted person:', result);
          resolve(result);
        },
        //If the transaction fails, this is called
        (_, err) => {
          console.error('Failed to delete person:', err);
          reject(err);
        },
      );
    });
  });
  return promise;
};

// Fetch all persons
export const fetchAllPersons = () => {
  const promise = new Promise((resolve, reject) => {
    db.transaction(tx => {
      //Here we select all from the table fish
      tx.executeSql(
        'select * from ' + tableName,
        [],
        (tx, result) => {
          let items = []; //Create a new empty Javascript array
          //And add all the items of the result (database rows/records) into that table
          for (let i = 0; i < result.rows.length; i++) {
            items.push(result.rows.item(i)); //The form of an item is {"type": "Leather boot", "id": 1, "size": 47}
            console.log('Fetched Person', result.rows.item(i)); //For debugging purposes to see the data in console window
          }
          console.log('Fetched All Persons', items); //For debugging purposes to see the data in console window
          resolve(items); //The data the Promise will have when returned
        },
        (tx, err) => {
          console.error('Error fetching persons:', err);
          reject(err);
        },
      );
    });
  });
  return promise;
};
