import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Animated,
  Dimensions,
} from "react-native";
import React, { useRef, useState } from "react";
import { Colors } from "../styles";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useSelector } from "react-redux";

export const SearchBar = ({ inputValue, onChangeInputValue }) => {
  const [inputState, setInputState] = useState(false);

  return (
    <View style={styles.container}>
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          maxWidth: Dimensions.get("screen").width,
        }}
      >
        <Greetings show={inputState} />
        <ExpandableInput
          activate={setInputState}
          isActive={inputState}
          inputValue={inputValue}
          onChangeInputValue={onChangeInputValue}
        />
      </View>
    </View>
  );
};

const Greetings = ({ show }) => {
  // @ts-ignore
  const { words } = useSelector((state) => state.wordsReducer);

  if (!show) {
    return (
      <View style={styles.greetings}>
        <Text style={styles.welcomeText}>
          {words.length ? "Welcome back!" : "Welcome!"}
        </Text>
      </View>
    );
  } else {
    return <View style={styles.greetings} />;
  }
};

const ExpandableInput = ({
  inputValue,
  onChangeInputValue,
  isActive,
  activate,
}) => {
  const textInput = useRef(null);
  const width = isActive ? "100%" : 0;

  const openInput = () => {
    textInput.current.blur();
    if (!isActive) {
      activate(true);
      setTimeout(() => {
        textInput.current.focus();
      }, 100);
    } else {
      activate(false);
      onChangeInputValue("");
    }
  };

  const onEndEditing = () => {
    if (!inputValue.length) activate(false);
  };
  return (
    <TouchableOpacity onPress={openInput}>
      <Animated.View
        style={{
          ...styles.searchButtonWrapper,
          width,
        }}
      >
        <View style={styles.searchButton}>
          <TextInput
            style={{ ...styles.textInput, width }}
            ref={textInput}
            keyboardAppearance="dark"
            placeholder="Search word"
            placeholderTextColor="rgba(255,255,255,0.38)"
            selectionColor={Colors.blue.color}
            selectTextOnFocus
            returnKeyType={"search"}
            onChangeText={onChangeInputValue}
            onEndEditing={onEndEditing}
            value={inputValue}
          />
          <Icon name="search" size={30} color={Colors.blue.color} />
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

const maxWidth = Dimensions.get("screen").width;

const styles = StyleSheet.create({
  container: {
    height: 100,
    width: "100%",
    maxWidth: "100%",
    backgroundColor: Colors.secondaryBackground.color,
  },
  greetings: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    paddingLeft: 24,
  },
  welcomeText: {
    fontSize: 26,
    fontWeight: "bold",
    color: "white",
  },
  searchButtonWrapper: {
    marginRight: 24,
    height: 48,
    minWidth: 48,
    maxWidth: maxWidth - 48,
    borderRadius: 4,
    backgroundColor: Colors.primaryBackground.color,
  },
  searchButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
  },
  textInput: {
    maxWidth: maxWidth - 96,
    color: "white",
    fontSize: 25,
  },
});
