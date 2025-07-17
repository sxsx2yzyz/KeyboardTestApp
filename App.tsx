/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState } from 'react';
import {
  Button,
  Dimensions,
  Keyboard,
  Text,
  TextInput,
  View,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardAvoidingView, KeyboardEvents, KeyboardProvider, useResizeMode } from 'react-native-keyboard-controller';
import { createModalStack, modalfy, ModalProvider } from 'react-native-modalfy';


const InputModal = () => {
  const [RNKeyboardEventHeight, setRNKeyboardEventHeight] = useState<number | null>(null);
  const [KeyboardEventsWillShowHeight, setKeyboardEventsWillShowHeight] = useState<number | null>(null);
  const [KeyboardEventsDidShowHeight, setKeyboardEventsDidShowHeight] = useState<number | null>(null);
  useResizeMode();
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (e) => {
      setRNKeyboardEventHeight(e.endCoordinates.height);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setRNKeyboardEventHeight(0);
    });
    const keyboardEventsWillShowListener = KeyboardEvents.addListener('keyboardWillShow', (e) => {
      setKeyboardEventsWillShowHeight(e.height);
    });
    const keyboardEventsWillHideListener = KeyboardEvents.addListener('keyboardWillHide', () => {
      setKeyboardEventsWillShowHeight(0);
    });
    const keyboardEventsDidShowListener = KeyboardEvents.addListener('keyboardDidShow', (e) => {
      setKeyboardEventsDidShowHeight(e.height);
    });
    const keyboardEventsDidHideListener = KeyboardEvents.addListener('keyboardDidHide', () => {
      setKeyboardEventsDidShowHeight(0);
    });
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
      keyboardEventsWillShowListener.remove();
      keyboardEventsWillHideListener.remove();
      keyboardEventsDidShowListener.remove();
      keyboardEventsDidHideListener.remove();
    }
  }, []);

  return (
    <KeyboardAvoidingView
      behavior="padding"
    style={{
      width: Dimensions.get('window').width,
      height: 400,
      backgroundColor: '#fff',
      borderRadius: 16,
      padding: 20,
      overflow: 'hidden',
    }}>
      <Text>RNKeyboardEventHeight: {RNKeyboardEventHeight}</Text>
      <Text>KeyboardEventsWillShowHeight: {KeyboardEventsWillShowHeight}</Text>
      <Text>KeyboardEventsDidShowHeight: {KeyboardEventsDidShowHeight}</Text>
      <TextInput style={{
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
      }}
        placeholder='Enter your name'
        placeholderTextColor='gray'
        autoFocus={true}
        keyboardType="default"
        returnKeyType="done"
        secureTextEntry={false}
        value='not avoid keyboard'
      />
      <Button title="Close" onPress={() => {
        modalfy().closeModal();
      }} />
    </KeyboardAvoidingView>
  )
}

const stack = createModalStack({
  InputModal: {
    modal: InputModal,
    position: "center"
  },
}, {
});
function App(): React.JSX.Element {
  return (
    <GestureHandlerRootView>
      <KeyboardProvider>
        <ModalProvider stack={stack}>
          <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <Button title="Open Modal" onPress={() => {
              modalfy().openModal('InputModal');
            }} />
          </View>
          {/* <KeyboardAvoidingView behavior="padding">
            <TextInput style={{
              height: 40,
              borderColor: 'gray',
              borderWidth: 1,
            }}
            value='avoid keyboard'
            />
            <View style = {{
              height: 100,
              backgroundColor: 'red',
            }}/>
          </KeyboardAvoidingView> */}
        </ModalProvider>
      </KeyboardProvider>
    </GestureHandlerRootView>
  )
}
export default App;
