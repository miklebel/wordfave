import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Animated,
  Dimensions,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useRef, useState } from "react";
import { Colors } from "../styles";
import Icon from "react-native-vector-icons/MaterialIcons";

export const AddWordModal = ({ navigation }) => {
  const textInput = useRef(null);

  const [modalVisible, setModalVisible] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const [inputValue, onChangeInputValue] = React.useState("");
  const openInput = () => {
    console.log('hello world');
    fadeOut();
    textInput.current.blur();
    setTimeout(() => {
      textInput.current.focus();
    }, 100);
  };

  const closeModal = () => {
    fadeIn();
    setModalVisible(!modalVisible);
    onChangeInputValue("");
  };

  const onEndEditing = () => {
    if (!inputValue.length) {
      closeModal();
    } else {
      addHandler();
    }
  };

  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      useNativeDriver: true,
      duration: 500,
    }).start();
  };

  const fadeOut = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      useNativeDriver: true,
      duration: 500,
    }).start();
  };

  const BigButton = (props) => {
    return (
      <TouchableOpacity onPress={() => closeModal()}>
        <Animated.View
          style={[
            styles.bigButton,
            {
              opacity: fadeAnim,
            },
          ]}
        >
          <Icon
            name="add"
            size={40}
            style={{ marginLeft: 2, marginTop: 2, color: "white" }}
          />
        </Animated.View>
      </TouchableOpacity>
    );
  };

  const addHandler = () => {
    if (inputValue.length) {
      closeModal();
      navigation.navigate("WordEdit", { word: inputValue, action: "add" });
    }
  };

  return (
    <View style={styles.container}>
      <BigButton />
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onShow={openInput}
        onRequestClose={() => closeModal()}
      >
        <TouchableOpacity style={styles.modal} onPress={() => closeModal()}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <View style={styles.inputModal}>
              <View
                style={{
                  flex: 1,
                  alignContent: "center",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "row",
                }}
              >
                <TextInput
                  style={{
                    width: maxWidth,
                    color: "white",
                    fontSize: 25,
                    marginLeft: 48,
                  }}
                  returnKeyType={"done"}
                  keyboardAppearance="dark"
                  placeholder="Type your word"
                  placeholderTextColor="rgba(255,255,255,0.38)"
                  selectionColor={Colors.blue.color}
                  ref={textInput}
                  onChangeText={onChangeInputValue}
                  onEndEditing={onEndEditing}
                  value={inputValue}
                />
              </View>
            </View>
          </KeyboardAvoidingView>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};
const maxWidth = Dimensions.get("screen").width;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 47,
  },
  bigButton: {
    backgroundColor: Colors.blue.color,
    width: 72,
    height: 72,
    borderRadius: 72 / 2,
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 12,
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
  },
  smallContainer: {
    width: 40,
    height: 40,
    borderRadius: 40 / 2,
    backgroundColor: Colors.blue.color,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.8)",
  },
  inputModal: {
    width: maxWidth,
    height: 64,
    backgroundColor: Colors.primaryBackground.color,
  },
});
