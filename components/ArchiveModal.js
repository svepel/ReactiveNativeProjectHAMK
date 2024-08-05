import React from 'react';
import {StyleSheet, Text, View, FlatList, Button, Modal} from 'react-native';

const ArchiveModal = ({visible, onClose, archivedPersons}) => {
  const renderArchivedItem = ({item}) => (
    <View>
      <Text>
        {item.name}, Age: {item.age}, Status: {item.flag}
      </Text>
    </View>
  );

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <Text style={styles.modalTitle}>Archived Persons</Text>
        <FlatList
          data={archivedPersons}
          renderItem={renderArchivedItem}
          keyExtractor={item => item.id.toString()}
        />
        <Button title="Close" onPress={onClose} />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 20,
  },
});

export default ArchiveModal;
