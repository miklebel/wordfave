import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import React, { useRef, useState } from 'react'
import { HomeScreenStyles, Colors } from '../styles'
import { useSelector, useDispatch } from 'react-redux'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { CategoryChip } from '../components/WordList'
import { removeWord } from '../redux/actions'

export const WordDetailsScreen = ({
  navigation,
  route: {
    params: { id, date }
  }
}) => {
  // @ts-ignore
  const { words } = useSelector(state => state.wordsReducer)
  const word = words.find(word => word.id === id)

  return (
    <SafeAreaView
      style={{
        ...HomeScreenStyles.container,
        backgroundColor: Colors.primaryBackground.color
      }}
    >
      <NavigationBar navigation={navigation} />
      <View
        style={{
          flexDirection: 'row',
          width: '100%'
        }}
      >
        <View style={{ marginLeft: 24, marginRight: 24 }}>
          <Text style={styles.title}>{word?.data.title}</Text>
          <View style={{ flexWrap: 'wrap', flexDirection: 'row', maxWidth: '80%' }}>
            <TouchableOpacity onPress={() => navigation.navigate('CategoryEdit', { wordId: id })}>
              <CategoryChip id={word?.data.categoryId} button />
            </TouchableOpacity>
            <Text
              style={{
                color: 'white',
                marginTop: 8,
                opacity: 0.4
              }}
            >
              Added {date}
            </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginRight: 24,
            position: 'absolute',
            top: -55,
            right: 0
          }}
        >
          <DeleteButton navigation={navigation} word={word} />
          <EditButton navigation={navigation} id={word?.id} />
        </View>
      </View>
      <TextBlock style={{ paddingTop: 10 }} text={word?.data.definition} />
      <ExampleBlock style={{ paddingTop: 20 }} text={word?.data.example} />
    </SafeAreaView>
  )
}

const ExampleBlock = ({ text, style }) => {
  if (text?.length) {
    return (
      <View style={{ ...style, width: '100%' }}>
        <Text
          style={{
            color: 'white',
            paddingLeft: 24,
            paddingBottom: 5,
            fontSize: 16,
            fontWeight: '400',
            letterSpacing: 0.4,
            lineHeight: 22
          }}
        >
          Example sentence
        </Text>
        <TextBlock text={text} />
      </View>
    )
  } else {
    return <View></View>
  }
}

const EditButton = ({ navigation, id }) => {
  const editHandler = () => navigation.navigate('WordEdit', { id, word: 'word', action: 'edit' })
  return (
    <TouchableOpacity style={styles.editButton} onPress={editHandler}>
      <Icon name="edit" size={30} color={Colors.blue.color} />
    </TouchableOpacity>
  )
}
const DeleteButton = ({ navigation, word }) => {
  const dispatch = useDispatch()

  const deleteHandler = () => {
    Alert.alert(`Do you want to delete "${word.data.title}"?`, 'This action is irreversible!', [
      {
        text: 'Cancel',
        style: 'cancel'
      },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          navigation.goBack({ wordId: word.id })
          dispatch(removeWord({ id: word.id }))
        }
      }
    ])
  }
  return (
    <TouchableOpacity style={{ ...styles.editButton, marginLeft: 10, marginRight: 10 }} onPress={deleteHandler}>
      <Icon name="delete" size={30} color={Colors.red.color} />
    </TouchableOpacity>
  )
}

const TextBlock = ({ text = '', style = {} }) => {
  const partOfSpeech = text.match(/\[([^)]+)\]/)

  return (
    <View style={{ ...style, paddingLeft: 24, paddingRight: 24, width: '100%' }}>
      <View
        style={{
          backgroundColor: Colors.secondaryBackground.color,
          borderRadius: 4
        }}
      >
        <Text
          style={{
            color: 'white',
            padding: 12,
            fontSize: 17,
            opacity: 0.9,
            lineHeight: 21,
            letterSpacing: 0.425
          }}
        >
          <Text style={{ fontWeight: 'bold', color: Colors.blue.color }}>{`${
            partOfSpeech?.[1] ? partOfSpeech?.[1] + '  ' : ''
          }`}</Text>
          {`${text.replace(partOfSpeech?.[0], '')}`}
        </Text>
      </View>
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
        <Icon name="arrow-back-ios" size={30} style={{ color: 'white' }} />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primaryBackground.color
  },
  editButton: {
    height: 48,
    width: 48,
    borderRadius: 4,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.secondaryBackground.color
  },
  navigationBar: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 60,
    backgroundColor: Colors.primaryBackground.color
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
  title: {
    color: 'white',
    fontSize: 24,
    lineHeight: 28,
    letterSpacing: 0.6,
    fontWeight: 'bold'
  }
})
