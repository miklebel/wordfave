import { NavigationContainer, DarkTheme } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./src/redux/store";
import { Provider } from "react-redux";
import React, { Component } from "react";
import { HomeScreen, WordEditScreen, WordDetailsScreen } from "./src/screens";
import { CategoryEditScreen } from "./src/screens/CategoryEditScreen";
import { StatusBar } from "expo-status-bar";
import SplashScreen from "react-native-splash-screen";
const Stack = createStackNavigator();
import Instabug from 'instabug-reactnative';

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <NavigationContainer theme={{ ...DarkTheme, dark: true }}>
            <StatusBar style={"light"} translucent={true} />
            <Stack.Navigator
              mode="modal"
              screenOptions={{
                headerShown: false,
                // ANDROID WORKAROUND
                // cardStyle: { backgroundColor: "transparent" },
                // cardStyleInterpolator: ({ current: { progress } }) => ({
                //   cardStyle: {
                //     opacity: progress.interpolate({
                //       inputRange: [0, 1],
                //       outputRange: [0, 1],
                //     }),
                //   },
                //   overlayStyle: {
                //     opacity: progress.interpolate({
                //       inputRange: [0, 1],
                //       outputRange: [0, 0.5],
                //       extrapolate: "clamp",
                //     }),
                //   },
                // }),
              }}
            >
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen name="WordEdit" component={WordEditScreen} />
              <Stack.Screen name="WordDetails" component={WordDetailsScreen} />
              <Stack.Screen
                name="CategoryEdit"
                component={CategoryEditScreen}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </PersistGate>
      </Provider>
    );
  }
}
