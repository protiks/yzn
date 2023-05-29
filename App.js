import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import DisplayName from './DisplayName';
import NewChat from './NewChat';


const Stack = createStackNavigator();

export default function App() {
  const [name, setName] = useState('protik')
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >

      <SafeAreaView style={styles.container}>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="Home">
              {(props) => <DisplayName {...props} setName={setName} />}
            </Stack.Screen>
            <Stack.Screen name="Chat">
              {(props) => <NewChat {...props} name={name} />}
            </Stack.Screen>
            {/* <Stack.Screen name="Chat" component={NewChat} /> */}
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
