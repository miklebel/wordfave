import {
  SafeAreaView,
  StatusBar,
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Animated
} from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { HomeScreenStyles, Colors } from '../styles'
import { useSelector, useDispatch } from 'react-redux'
import { addWord, editWord } from '../redux/actions'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

const fetchWithTimeout = (url, options, timeout = 7000) => {
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), timeout))
  ])
}

export const WordEditScreen = ({
  navigation,
  route: {
    params: { word, id, action }
  }
}) => {
  let title = word

  let [exampleValue, onChangeExampleValue] = React.useState('')
  let [definitionValue, onChangeDefinitionValue] = React.useState('')
  let [selectedExampleValue, onChangeSelectedExampleValue] = React.useState('')
  let [selectedDefinitionValue, onChangeSelectedDefinitionValue] = React.useState('')

  let [oxfordResults, onChangeOxfordResults] = React.useState([])
  if (action === 'edit') {
    // @ts-ignore
    const { words } = useSelector(state => state.wordsReducer)
    const word = words.find(word => word.id === id)

    if (
      oxfordResults.find(oxfordWord =>
        oxfordWord.definitions.some(definition => word.data.definition.includes(definition))
      )
    ) {
      ;[selectedDefinitionValue, onChangeSelectedDefinitionValue] = React.useState(word.data.definition)
    } else {
      ;[definitionValue, onChangeDefinitionValue] = React.useState(word.data.definition)
    }
    if (oxfordResults.find(oxfordWord => oxfordWord.examples.some(example => word.data.example.includes(example)))) {
      ;[selectedExampleValue, onChangeSelectedExampleValue] = React.useState(word.data.example)
    } else {
      ;[exampleValue, onChangeExampleValue] = React.useState(word.data.example)
    }

    title = word.data.title
  }
  const loaderOpacity = useRef(new Animated.Value(1)).current
  const fadeOut = () => {
    // Will change fadeAnim value to 0 in 3 seconds
    Animated.timing(loaderOpacity, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true
    }).start()
  }

  useEffect(() => {
    fetchWithTimeout(
      `https://wordfave-api.herokuapp.com/words/${title}`,
      5000
    )
      .then(response => response.json())
      .then(json => {
        onChangeOxfordResults(json);
        fadeOut()
      })
      .catch(err => {
        console.log(err)
        console.log('fetched with error')
        fadeOut()
      })
  }, [])

  return (
    <SafeAreaView
      style={{
        ...HomeScreenStyles.container,
        backgroundColor: Colors.secondaryBackground.color
      }}
    >
      <StatusBar animated={true} backgroundColor={Colors.secondaryBackground.color} barStyle="light-content" />

      <NavigationBar navigation={navigation} action={action} />
      <Title word={title} />
      <Selections
        isEdit={action === 'edit'}
        oxfordResults={oxfordResults}
        word={title}
        definitionValue={definitionValue}
        exampleValue={exampleValue}
        onChangeDefinitionValue={onChangeDefinitionValue}
        onChangeExampleValue={onChangeExampleValue}
        loaderOpacity={loaderOpacity}
        selectedExampleValue={selectedExampleValue}
        onChangeSelectedExampleValue={onChangeSelectedExampleValue}
        selectedDefinitionValue={selectedDefinitionValue}
        onChangeSelectedDefinitionValue={onChangeSelectedDefinitionValue}
      />
      <SaveButton
        id={id}
        action={action}
        navigation={navigation}
        word={title}
        example={exampleValue}
        definition={definitionValue}
        selectedExampleValue={selectedExampleValue}
        selectedDefinitionValue={selectedDefinitionValue}
      />
    </SafeAreaView>
  )
}

const Selections = ({
  word,
  selectedExampleValue,
  onChangeSelectedExampleValue,
  selectedDefinitionValue,
  onChangeSelectedDefinitionValue,
  exampleValue,
  definitionValue,
  onChangeExampleValue,
  onChangeDefinitionValue,
  oxfordResults,
  loaderOpacity,
  isEdit
}) => {
  return (
    <SafeAreaView style={{ width: '100%', flex: 1 }}>
      <KeyboardAwareScrollView extraHeight={190}>
        <Definition
          isEdit={isEdit}
          word={word}
          selectedDefinitionValue={selectedDefinitionValue}
          onChangeSelectedDefinitionValue={onChangeSelectedDefinitionValue}
          value={definitionValue}
          onChange={onChangeDefinitionValue}
          oxfordResults={oxfordResults}
          // selectDefinitionInput={}
        />
        <Example
          isEdit={isEdit}
          word={word}
          selectedExampleValue={selectedExampleValue}
          onChangeSelectedExampleValue={onChangeSelectedExampleValue}
          value={exampleValue}
          onChange={onChangeExampleValue}
          oxfordResults={oxfordResults}
        />
      </KeyboardAwareScrollView>
      <Animated.View pointerEvents="none" style={[styles.loading, { opacity: loaderOpacity }]}>
        <ActivityIndicator size={'large'} />
      </Animated.View>
    </SafeAreaView>
  )
}

const Definition = ({
  word,
  value,
  onChange,
  oxfordResults,
  selectedDefinitionValue,
  onChangeSelectedDefinitionValue,
  isEdit
}) => {
  const clearSelection = () => {
    onChangeSelectedDefinitionValue('')
  }
  const oxfordDefinitions = oxfordResults
    .reduce((arr, word) => {
      return [...arr, ...word.definitions.map(definition => `[${word.lexicalCategory}] ${definition}`)]
    }, []);

  if (oxfordDefinitions.length && !isEdit) useEffect(() => onChangeSelectedDefinitionValue(oxfordDefinitions[0]), [])

  return (
    <View style={{ width: '100%' }}>
      <View style={styles.optionTitleContainer}>
        <Text style={styles.optionTitleText}>
          Enter a definition for "<Text style={{ fontWeight: 'bold' }}>{word}</Text>"
        </Text>
      </View>
      <FlatList
        scrollEnabled={false}
        data={oxfordDefinitions}
        keyExtractor={(item, index) => `${index}`}
        renderItem={({ item }) => (
          <OxfordResult
            select={onChangeSelectedDefinitionValue}
            text={item}
            selected={selectedDefinitionValue === item}
          />
        )}
      />
      <CustomInputField
        value={value}
        selectedExists={!!selectedDefinitionValue.length}
        onChange={onChange}
        placeholder={'Your definition'}
        clearSelection={() => clearSelection()}
      />
    </View>
  )
}

const Example = ({
  word,
  value,
  onChange,
  oxfordResults,
  selectedExampleValue,
  onChangeSelectedExampleValue,
  isEdit
}) => {
  const clearSelection = () => {
    onChangeSelectedExampleValue('')
  }
  const oxfordExamples = oxfordResults
    .reduce((arr, word) => {
      return [...arr, ...word.examples.map(example => `[${word.lexicalCategory}] ${example}`)]
    }, []);

  if (oxfordExamples.length && !isEdit) useEffect(() => onChangeSelectedExampleValue(oxfordExamples[0]), [])

  return (
    <View style={{ width: '100%', paddingBottom: 70 }}>
      <View style={styles.optionTitleContainer}>
        <Text style={styles.optionTitleText}>
          Enter an example for "<Text style={{ fontWeight: 'bold' }}>{word}</Text>"
        </Text>
      </View>
      <FlatList
        data={oxfordExamples}
        scrollEnabled={false}
        keyExtractor={(item, index) => `${index}`}
        renderItem={({ item }) => (
          <OxfordResult select={onChangeSelectedExampleValue} text={item} selected={selectedExampleValue === item} />
        )}
      />
      <CustomInputField
        value={value}
        onChange={onChange}
        selectedExists={!!selectedExampleValue.length}
        placeholder={'Your example'}
        clearSelection={() => clearSelection()}
      />
    </View>
  )
}

const OxfordResult = ({ text, select, selected }) => {
  const partOfSpeech = text.match(/\[([^)]+)\]/)

  return (
    <TouchableOpacity
      style={{ ...styles.optionContainer, borderColor: selected ? Colors.blue.color : 'grey' }}
      onPress={() => select(text)}
    >
      <Text style={styles.optionText}>
        <Text style={{ fontWeight: 'bold', color: Colors.blue.color }}>{partOfSpeech?.[1]}</Text>
        {`  ${text.replace(partOfSpeech?.[0], '')}`}
      </Text>
    </TouchableOpacity>
  )
}

const SaveButton = ({
  navigation,
  word,
  example,
  definition,
  action,
  id,
  selectedDefinitionValue,
  selectedExampleValue
}) => {
  const dispatch = useDispatch()

  const wordHandler =
    action === 'edit'
      ? newWord => dispatch(editWord({ data: newWord, id }))
      : newWord => dispatch(addWord({ data: newWord }))

  const saveWord = () => {
    const newWord = {
      title: word,
      example: selectedExampleValue.length ? selectedExampleValue : example,
      definition: selectedDefinitionValue.length ? selectedDefinitionValue : definition
    }
    wordHandler(newWord)
    navigation.goBack()
  }

  const emptyFieldsChecker = () => {
    return selectedDefinitionValue.length || definition.length
  }
  return (
    <TouchableOpacity
      style={{
        ...styles.saveButtonContainer,
        ...(!emptyFieldsChecker() ? { backgroundColor: 'grey' } : {})
      }}
      disabled={!emptyFieldsChecker()}
      onPress={saveWord}
    >
      <Text style={styles.saveButtonText}>{action === 'edit' ? 'Save Word' : 'Add Word'}</Text>
    </TouchableOpacity>
  )
}

const CustomInputField = ({ value, onChange, placeholder, clearSelection, selectedExists }) => {
  const [isActive, activate] = useState(false)
  const textInput = useRef(null)

  const closeInputHandler = ({ nativeEvent }) => {
    if (nativeEvent.key === 'Enter') {
      textInput.current.blur()
    }
  }

  const onFocus = () => {
    activate(true)
    clearSelection()
  }
  return (
    <View style={styles.optionInputContainer}>
      <TextInput
        style={{
          ...styles.optionTextInput,
          opacity: value.length ? 1 : 0.5,
          borderColor: isActive || (value.length && !selectedExists) ? Colors.blue.color : 'gray'
        }}
        multiline
        onKeyPress={closeInputHandler}
        ref={textInput}
        placeholderTextColor="rgba(255,255,255,0.38)"
        selectionColor={Colors.blue.color}
        value={value}
        keyboardAppearance="dark"
        placeholder={placeholder}
        returnKeyType={'done'}
        blurOnSubmit={true}
        onFocus={onFocus}
        onEndEditing={() => activate(false)}
        onChangeText={onChange}
      />
    </View>
  )
}

const Title = ({ word }) => {
  return (
    <View style={styles.titleContainer}>
      <Text style={styles.titleText}>{word}</Text>
    </View>
  )
}

const NavigationBar = ({ navigation, action }) => {
  const cancelHandler = () => {
    navigation.goBack()
  }
  return (
    <View style={styles.navigationBar}>
      <TouchableOpacity style={styles.cancelButtonWrapper} onPress={cancelHandler}>
        <Text style={styles.cancelText}>Cancel</Text>
      </TouchableOpacity>
      <Text style={styles.navigationTitle}>{action === 'edit' ? 'Edit Your Word' : 'Add Your Word'}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  navigationBar: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 60,
    backgroundColor: Colors.secondaryBackground.color
  },
  navigationTitle: {
    fontSize: 17,
    fontWeight: '700',
    lineHeight: 28,
    letterSpacing: 0.43,
    color: 'white'
  },
  cancelButtonWrapper: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    left: 0,
    paddingLeft: 24,
    paddingRight: 24
  },
  cancelText: {
    fontSize: 16,
    lineHeight: 22,
    letterSpacing: 0.4,
    color: Colors.blue.color
  },
  titleContainer: {
    justifyContent: 'center',
    width: '100%',
    height: 65,
    backgroundColor: Colors.secondaryBackground.color
  },
  titleText: {
    paddingLeft: 24,
    paddingRight: 24,
    color: 'white',
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 28,
    letterSpacing: 0.6
  },
  optionTitleContainer: {
    backgroundColor: Colors.primaryBackground.color
  },
  optionTitleText: {
    lineHeight: 20,
    marginTop: 5,
    marginBottom: 5,
    paddingLeft: 24,
    paddingRight: 24,
    color: 'white',
    fontSize: 16,
    opacity: 0.66
  },
  optionInputContainer: {
    backgroundColor: Colors.secondaryBackground.color,
    marginTop: 12
  },
  optionTextInput: {
    backgroundColor: Colors.primaryBackground.color,
    marginLeft: 24,
    marginRight: 24,

    marginBottom: 12,
    padding: 10,
    color: 'white',
    borderColor: Colors.blue.color,
    borderRadius: 4,
    borderWidth: 1,
    fontSize: 17,
    lineHeight: 23,
    letterSpacing: 0.425
  },
  optionContainer: {
    backgroundColor: Colors.primaryBackground.color,
    marginLeft: 24,
    marginRight: 24,
    marginTop: 12,
    padding: 10,
    borderColor: 'grey',
    borderRadius: 4,
    borderWidth: 1
  },
  optionText: {
    fontSize: 17,
    color: 'white',
    lineHeight: 23,
    letterSpacing: 0.425
  },
  saveButtonContainer: {
    position: 'absolute',
    bottom: 42,
    backgroundColor: Colors.blue.color,
    width: 186,
    height: 48,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center'
  },
  saveButtonText: {
    fontSize: 17,
    lineHeight: 21,
    fontWeight: 'bold',
    color: 'white',
    letterSpacing: 0.425
  },
  loading: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primaryBackground.color
  }
})
