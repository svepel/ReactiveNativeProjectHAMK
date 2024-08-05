import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  FlatList,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  init,
  addPerson,
  updatePerson,
  deletePerson,
  fetchAllPersons,
  archivePerson,
} from './database/db';

import ArchiveModal from './components/ArchiveModal';

// Initialize the database
init()
  .then(() => {
    console.log('Database creation succeeded!');
  })
  .catch(err => {
    console.log('Database IS NOT initialized! ' + err);
  });

const App = () => {
  const [personsList, setPersonsList] = useState([]);
  const [saveUpdate, setSaveUpdate] = useState('Save');
  const [updateIndex, setUpdateIndex] = useState(-1);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [archivedModalVisible, setArchivedModalVisible] = useState(false);

  const handleName = text => {
    setName(text);
  };
  const handleAge = text => {
    setAge(text);
  };

  useEffect(() => {
    readAllPersons();
  }, []);

  const savePerson = async () => {
    if (updateIndex >= 0) {
      updatePersonInDb();
    } else {
      try {
        const dbResult = await addPerson(name, age);
        console.log('savePerson dbResult: ' + dbResult); //For debugging purposes to see the data in the console screen
        await readAllPersons();
      } catch (err) {
        console.error('Error saving person: ', err);
      } finally {
        setName('');
        setAge('');
      }
    }
  };
  const setPersonToUpdate = index => {
    setUpdateIndex(index);
    setName(personsList[index].name);
    setAge('' + personsList[index].age); //Must be changed to string, because used in value property of TextInput
    setSaveUpdate('Update');
  };

  const openThreeButtonAlert = (index, id) =>
    Alert.alert('Confirm?', 'Are you sure you want to delete?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'Archive',
        onPress: () => {
          archivePersonInDb(index);
          console.log('Archived - archive pressed');
        },
      },
      {
        text: 'OK',
        onPress: () => {
          deletePersonFromDb(id);
          console.log('Delete - ok pressed');
        },
      },
    ]);

  const deletePersonFromDb = async id => {
    try {
      const dbResult = await deletePerson(id);
      console.log('deletePerson dbResult: ', dbResult);
      await readAllPersons();
    } catch (err) {
      console.error('Error deleting person: ', err);
    }
  };

  const updatePersonInDb = async () => {
    try {
      const dbResult = await updatePerson(
        personsList[updateIndex].id,
        name,
        age,
      );
      console.log('updatePerson dbResult: ', dbResult);
      await readAllPersons();
    } catch (err) {
      console.error('Error updating person: ', err);
    } finally {
      setUpdateIndex(-1);
      setSaveUpdate('Save');
      setName('');
      setAge('');
    }
  };

  const archivePersonInDb = async index => {
    try {
      const person = personsList[index];
      if (!person || !person.id) {
        console.error('Person or Person ID is undefined', person);
        return;
      }
      console.log('Archiving person with ID:', person.id);
      await archivePerson(person.id);
      console.log('Person archived successfully:', person);
      await readAllPersons(); //Refresh the list
    } catch (err) {
      console.error('Failed to archive person:', err);
    }
  };

  const readAllPersons = async () => {
    // await fetchAllBoots()
    // .then((res)=>{//The parametr res has the value which is returned from the fetchAllBoots function in db.js
    //   console.log(res);//For debugging purposes to see the data in the console screen
    //   setBootList(res);
    // })
    // .catch((err)=>{console.log(err)})
    // .finally(()=>{console.log("All boots are read!")});//For debugging purposes to see the routine has ended

    //The above commented can be used as well as the code below

    try {
      const dbResult = await fetchAllPersons();
      console.log('dbResult readAllPersons in App.js:', dbResult);
      setPersonsList(dbResult);
    } catch (err) {
      console.error('Error reading all persons: ', err);
    } finally {
      console.log('All persons are read!');
    }
  };

  const archivedPersons = personsList.filter(
    person => person.flag === 'Archived',
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Attendance list</Text>

      <FlatList
        data={personsList.filter(person => person.flag !== 'Archived')}
        renderItem={item => (
          <TouchableOpacity
            onPress={() => setPersonToUpdate(item.index)}
            onLongPress={() => openThreeButtonAlert(item.index, item.item.id)}>
            <View>
              <Text style={styles.listItem}>
                {item.index + 1 + ')'} {item.item.name + ','}{' '}
                {'age: ' + item.item.age}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={item => item.id.toString()}
      />

      <View style={styles.inputContainer}>
        <Text style={styles.titleInputContainer}>Add person:</Text>
        <View style={styles.inputTextContainer}>
          <View style={styles.inputFields}>
            <TextInput
              value={name}
              onChangeText={handleName}
              style={[styles.input, styles.nameInput]}
              placeholder="Name"
            />
            <TextInput
              value={age}
              onChangeText={handleAge}
              style={[styles.input, styles.ageInput]}
              placeholder="Age"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.buttonWrapper}>
            <Button
              title={saveUpdate}
              onPress={() => savePerson()}
              color={styles.button.color}
            />
          </View>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <View style={styles.buttonWrapper}>
          <Button title="Read" onPress={() => readAllPersons()} />
        </View>
        <Button
          title="Archived"
          onPress={() => setArchivedModalVisible(true)}
        />
      </View>

      <ArchiveModal
        visible={archivedModalVisible}
        onClose={() => setArchivedModalVisible(false)}
        archivedPersons={archivedPersons}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  listItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  listContainer: {
    //paddingBottom: 20,
  },
  input: {
    flex: 1,
    borderColor: 'black',
    borderWidth: 1,
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  nameInput: {
    flex: 7, // 70% of the width
  },
  ageInput: {
    flex: 3, // 30% of the width
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginVertical: 10,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 10,
  },
  inputTextContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    width: '100%',
    padding: 5,
    borderRadius: 10,
  },

  inputFields: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  titleInputContainer: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    marginVertical: 10,
    marginTop: 10,
    marginBottom: 10,
  },
  button: {
    color: 'black',
  },
  buttonWrapper: {
    marginVertical: 10,
  },
});

export default App;
