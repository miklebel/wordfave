import { StyleSheet } from "react-native";
import { Colors } from "./Main";
import { Platform, StatusBar } from "react-native";
export const HomeScreenStyles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    flex: 1,
    alignItems: "center",
    backgroundColor: Colors.primaryBackground.color,
    flexDirection: "column",
  },
});
