import {
  SafeAreaView,
  StatusBar,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Alert
} from 'react-native'
import React, { useRef, useState } from 'react'
import { HomeScreenStyles, Colors } from '../styles'
import { useDispatch, useSelector } from 'react-redux'
import { RadioButton } from '../components/RadioButton'

import { addCategory, assignCategory, removeCategory } from '../redux/actions'
import Icon from 'react-native-vector-icons/MaterialIcons'

export const CategoryEditScreen = ({
  navigation,
  route: {
    params: { wordId }
  }
}) => {
  const flatList = useRef(null)
  const [selectedCategoryId, selectedCategoryIdOnChange] = useState('')

  return (
    <SafeAreaView
      style={{
        ...HomeScreenStyles.container,
        backgroundColor: Colors.secondaryBackground.color
      }}
    >
      <StatusBar animated={true} backgroundColor={Colors.secondaryBackground.color} barStyle="light-content" />
      <NavigationBar navigation={navigation} />
      <Text style={styles.hintText}>Use categories to group words by the topics you are learning about.</Text>
      <NewCategoryBlock selectedCategoryIdOnChange={selectedCategoryIdOnChange} flatList={flatList} />
      <ExistingCategoriesBlock
        flatList={flatList}
        wordId={wordId}
        selectedCategoryId={selectedCategoryId}
        selectedCategoryIdOnChange={selectedCategoryIdOnChange}
      />
      <SaveButton navigation={navigation} categoryId={selectedCategoryId} wordId={wordId} />
    </SafeAreaView>
  )
}
const SaveButton = ({ navigation, wordId, categoryId }) => {
  const dispatch = useDispatch()

  const saveWord = () => {
    dispatch(assignCategory({ wordId, categoryId }))
    navigation.goBack()
  }
  return (
    <TouchableOpacity
      style={{
        ...styles.saveButtonContainer,
        display: categoryId.length ? 'flex' : 'none'
      }}
      onPress={saveWord}
    >
      <Text style={styles.saveButtonText}>Save</Text>
    </TouchableOpacity>
  )
}

const NewCategoryBlock = ({ flatList, selectedCategoryIdOnChange }) => {
  const [color, colorOnChange] = useState('#FFD36F')
  const [newCategoryName, newCategoryNameOnChange] = useState('')

  return (
    <View style={styles.newCategoryBlockContainer}>
      <Text style={styles.newCategoryBlockHeading}>Enter category name</Text>
      <CustomInputField
        selectedCategoryIdOnChange={selectedCategoryIdOnChange}
        flatList={flatList}
        color={color}
        value={newCategoryName}
        onChange={newCategoryNameOnChange}
        placeholder="Category name"
      />
      <View>
        <CategoryColorSelector colorOnChange={colorOnChange} />
      </View>
    </View>
  )
}

const ExistingCategoriesBlock = ({ wordId, flatList, selectedCategoryId, selectedCategoryIdOnChange }) => {
  // @ts-ignore
  const { categories, words } = useSelector(state => state.wordsReducer)
  const dispatch = useDispatch()
  const wordTitleById = words.find(word => word.id === wordId).data.title
  const countWordsByCategory = categoryId => {
    return words.filter(word => word.data.categoryId === categoryId).length
  }

  const highlighted = color => {
    return { borderColor: color }
  }

  const deleteConfirmation = ({ category }) => {
    Alert.alert(`Do you want to delete "${category.data.name}"?`, 'This action is irreversible!', [
      {
        text: 'Cancel',
        style: 'cancel'
      },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => dispatch(removeCategory({ id: category.id }))
      }
    ])
  }

  const DeleteCategoryButton = ({ selected, category }) => {
    return (
      <TouchableOpacity
        style={{
          ...styles.deleteButton,
          borderColor: selected ? Colors.red.color : 'grey',
          backgroundColor: selected ? Colors.red.color : 'grey'
        }}
        onPress={() => deleteConfirmation({ category })}
      >
        <Icon
          name="delete"
          size={30}
          style={{
            color: selected ? 'white' : Colors.primaryBackground.color
          }}
        />
      </TouchableOpacity>
    )
  }

  const renderItem = ({ item }) => {
    const selected = selectedCategoryId === item.id
    return (
      <TouchableOpacity
        onPress={() => selectedCategoryIdOnChange(item.id)}
        style={{
          ...styles.existingCategoryContainer,
          borderLeftColor: item.data.color,
          ...(selected ? highlighted(item.data.color) : {})
        }}
      >
        <View>
          <Text style={styles.existingCategoryTitle}>{item.data.name}</Text>
          <Text style={styles.wordsAmount}>{countWordsByCategory(item.id)} words</Text>
        </View>

        <DeleteCategoryButton category={item} selected={selected} />
      </TouchableOpacity>
    )
  }
  return (
    <View style={{ width: '100%', flex: 1 }}>
      <Text
        style={{
          ...styles.newCategoryBlockHeading,
          marginLeft: 24,
          marginBottom: 11,
          display: categories.length ? 'flex' : 'none'
        }}
      >
        Add "<Text style={{ fontWeight: 'bold' }}>{wordTitleById}</Text>" to existing category
      </Text>
      <FlatList
        ref={flatList}
        style={styles.existingCategoriesBlock}
        data={categories}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        getItemLayout={(data, index) => ({
          length: 74,
          offset: 74 * index,
          index
        })}
      />
    </View>
  )
}

const CategoryColorSelector = ({ colorOnChange }) => {
  const colors = ['#79C47E', '#FFD36F', '#FA9C0D', '#FA695C', '#FFA6C9', '#7B64DF', '#FFFFFF']
  const [colorIndex, colorIndexOnChange] = useState(0)
  const colorChangeHandler = (color, index) => {
    colorIndexOnChange(index)
    colorOnChange(color)
  }
  const Buttons = colors.map((color, index) => {
    return (
      <TouchableOpacity key={index} onPress={() => colorChangeHandler(color, index)}>
        <RadioButton style={{ marginRight: 10 }} selected={colorIndex === index ? true : false} color={color} />
      </TouchableOpacity>
    )
  })
  return <View style={styles.colorContainer}>{Buttons}</View>
}

const CustomInputField = ({ value, onChange, placeholder, color, flatList, selectedCategoryIdOnChange }) => {
  const [isActive, activate] = useState(false)
  const textInput = useRef(null)

  const dispatch = useDispatch()

  const closeInputHandler = () => {
    activate(false)

    onChange('')
    textInput.current.blur()
    if (value.trim().length) {
      const newCategoryId = dispatch(addCategory({ data: { name: value.trim(), color } }))
      setTimeout(() => {
        flatList.current.scrollToEnd({ animated: true })
        selectedCategoryIdOnChange(newCategoryId)
      }, 400)
    }
  }

  return (
    <View style={styles.optionInputContainer}>
      <TextInput
        style={{
          ...styles.optionTextInput,
          opacity: 1,
          borderLeftColor: color,
          borderColor: isActive ? color : Colors.primaryBackground.color
        }}
        ref={textInput}
        placeholderTextColor="rgba(255,255,255,0.38)"
        selectionColor={Colors.blue.color}
        value={value}
        placeholder={placeholder}
        keyboardAppearance={'dark'}
        blurOnSubmit={true}
        returnKeyType={'done'}
        onFocus={() => activate(true)}
        onEndEditing={() => closeInputHandler()}
        onChangeText={onChange}
      />
    </View>
  )
}

const NavigationBar = ({ navigation }) => {
  const cancelHandler = () => {
    navigation.goBack()
  }
  return (
    <View style={styles.navigationBar}>
      <TouchableOpacity style={styles.cancelButtonWrapper} onPress={cancelHandler}>
        <Text style={styles.cancelText}>Cancel</Text>
      </TouchableOpacity>
      <Text style={styles.navigationTitle}>Add Category</Text>
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
  optionInputContainer: {
    alignItems: 'stretch',
    flexDirection: 'row',
    backgroundColor: Colors.secondaryBackground.color
  },
  optionTextInput: {
    flexGrow: 1,
    borderLeftWidth: 5,
    backgroundColor: Colors.primaryBackground.color,
    marginTop: 10,
    padding: 15,
    color: 'white',
    borderColor: Colors.blue.color,
    borderRadius: 4,
    borderWidth: 1,
    fontSize: 16,
    lineHeight: 20,
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
  hintText: {
    color: 'white',
    opacity: 0.66,
    fontSize: 16,
    lineHeight: 22,
    letterSpacing: 0.4,
    textAlign: 'center',
    marginLeft: 46,
    marginRight: 46,
    marginBottom: 25
  },
  newCategoryBlockContainer: {
    flexDirection: 'column',
    paddingLeft: 24,
    paddingRight: 24,
    height: 170,
    width: '100%'
  },
  newCategoryBlockHeading: {
    color: 'white',
    opacity: 0.66,
    fontSize: 16,
    lineHeight: 22,
    letterSpacing: 0.4
  },
  colorContainer: {
    marginTop: 20,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    height: 40
  },
  existingCategoryTitle: {
    marginTop: 10,
    marginLeft: 15,
    marginBottom: 5,
    opacity: 0.9,
    color: 'white',
    fontSize: 16,
    lineHeight: 19,
    letterSpacing: 0.4
  },
  existingCategoriesBlock: {
    marginBottom: 70,
    paddingRight: 24,
    paddingLeft: 24
  },
  existingCategoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
    backgroundColor: Colors.primaryBackground.color,
    borderColor: '#505563',
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderLeftWidth: 3,
    borderBottomWidth: 1,
    borderRadius: 4,
    marginBottom: 8
  },
  wordsAmount: {
    color: 'white',
    fontSize: 14,
    opacity: 0.38,
    letterSpacing: 0.35,
    lineHeight: 22,
    marginLeft: 15,
    marginBottom: 8
  },
  addButton: {
    backgroundColor: Colors.blue.color,
    marginTop: 10,
    width: 50,
    height: 50,
    borderRadius: 50 / 2,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center'
  },
  deleteButton: {
    color: 'white',
    marginTop: 15,
    marginRight: 15,
    marginBottom: 'auto',
    borderRadius: 4,
    borderWidth: 2
  }
})
