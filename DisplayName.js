import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function DisplayName(props) {
  const { setName } = props
  const [inputName, setInputName] = useState('');
  const navigation = useNavigation();

  const handleNameSubmit = () => {
    setName(inputName)
    navigation.navigate('Chat')
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        onChangeText={setInputName}
        value={inputName}
        placeholder="Enter your name"
      />
      <View style={styles.buttonContainer}>
        <Button title="Submit" onPress={handleNameSubmit} returnKeyType="send" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 10,
  },
  input: {
    marginBottom: 10,
    width: '50%',
    alignSelf: 'center',
  },
  buttonContainer: {
    alignSelf: 'center',
    width: '50%',
  },
});
