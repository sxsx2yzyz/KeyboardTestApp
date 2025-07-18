/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  Button,
  Dimensions,
  Keyboard,
  StatusBar,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardAvoidingView, KeyboardEvents, KeyboardProvider, useResizeMode } from 'react-native-keyboard-controller';
import { createModalStack, modalfy, ModalProvider } from 'react-native-modalfy';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';


const InputModal = ({ modal: { closeModal, getParam } }) => {
  const [KeyboardEventsWillShowHeight, setKeyboardEventsWillShowHeight] = useState<number>(0);
  const [bottomOfComponent, setBottomOfComponent] = useState<number>(0);
  const { height: windowHeight } = useWindowDimensions();
  const { height: screenHeight } = Dimensions.get('screen');
  const containerRef = useRef<View>(null);
  const marginKeyboard = 100;
  const translateY = Math.min(0, screenHeight - KeyboardEventsWillShowHeight - bottomOfComponent - marginKeyboard);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: withTiming(translateY, { duration: 200 }) }],
  }));

  const onLayout = () => {
    containerRef.current?.measure((x, y, width, height, pageX, pageY) => {
      setBottomOfComponent(pageY + height);
    });
  };
  const keyboardType = getParam('keyboardType');
  useResizeMode();
  useEffect(() => {
    const keyboardEventsWillShowListener = KeyboardEvents.addListener('keyboardWillShow', (e) => {
      setKeyboardEventsWillShowHeight(e.height);
    });
    const keyboardEventsWillHideListener = KeyboardEvents.addListener('keyboardWillHide', () => {
      setKeyboardEventsWillShowHeight(0);
    });
    return () => {
      keyboardEventsWillShowListener.remove();
      keyboardEventsWillHideListener.remove();
    }
  }, []);

  return (
    <>
      <Animated.View
        ref={containerRef}
        onLayout={onLayout}
        style={[{
          width: Dimensions.get('window').width,
          backgroundColor: '#fff',
          borderRadius: 16,
          padding: 20,
        }, animatedStyle]}>
        <Text>KeyboardHeight: {KeyboardEventsWillShowHeight}</Text>
        <Text>BottomOfComponent: {bottomOfComponent}</Text>
        <Text>translateY: {Math.min(0, windowHeight - (KeyboardEventsWillShowHeight || 0) - bottomOfComponent)}</Text>
        <Text>windowHeight: {windowHeight}</Text>
        <Text>screenHeight: {screenHeight}</Text>
        <Text>marginKeyboard: {marginKeyboard}</Text>
        <TextInput style={{
          height: 40,
          borderColor: 'gray',
          borderWidth: 1,
        }}
          placeholder='Enter your name'
          placeholderTextColor='gray'
          autoFocus={true}
          keyboardType={keyboardType}
          returnKeyType="done"
          secureTextEntry={false}
        // value='not avoid keyboard'
        />
        <Button title="Close" onPress={() => {
          modalfy().closeModal();
        }} />

      </Animated.View>
      <Animated.View style={[{
        height: marginKeyboard,
        width: '100%',
        borderBottomColor: "red",
        borderBottomWidth: 5,
      }, animatedStyle]}>

      </Animated.View>
    </>
  )
}

const stack = createModalStack({
  InputModal: {
    modal: InputModal,
    backBehavior: 'none',
  },
}, {
  backdropOpacity: 0.6,
  backdropAnimationDuration: 200,
  disableFlingGesture: true,
  stackContainerStyle: {
    zIndex: 2000,
  },
});
function App(): React.JSX.Element {
  return (
    <GestureHandlerRootView style={{flex: 1, backgroundColor: '#fff'}}>
      <KeyboardProvider
        statusBarTranslucent={true}
        navigationBarTranslucent={true}
      >
        <ModalProvider stack={stack}>
          <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <Button title="Open number-pad Modal" onPress={() => {
              modalfy().openModal('InputModal', {
                keyboardType: 'numeric'
              });
            }} />
            <Button title="Open default Modal" onPress={() => {
              modalfy().openModal('InputModal', {
                keyboardType: 'visible-password'
              });
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
