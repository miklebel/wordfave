import { Button, SafeAreaView, StatusBar } from 'react-native'
import React, { useEffect } from 'react'
import { HomeScreenStyles, Colors } from '../styles'
import { SearchBar } from '../components/SearchBar'
import { AddWordModal } from '../components/AddWordModal'
import { WordList } from '../components/WordList'
import { useSelector } from 'react-redux'
import SplashScreen from 'react-native-splash-screen'
import { sendWoopraEvent } from '../services/Woopra'

export const HomeScreen = ({ navigation }) => {
  // @ts-ignore
  const { words } = useSelector(state => state.wordsReducer)
  const [searchValue, onChangeSearchValue] = React.useState('')

  const filteredWords = words.filter(word => {
    if (searchValue.length) {
      return word.data.title.toLowerCase().includes(searchValue.toLowerCase())
    } else {
      return word
    }
  })
  useEffect(() => {
    sendWoopraEvent({ eventName: 'APPLICATION_LAUNCH', eventData: 'none' })
  })
  setTimeout(() => SplashScreen.hide(), 200)

  return (
    <SafeAreaView style={HomeScreenStyles.container}>
      <StatusBar animated={true} backgroundColor={Colors.secondaryBackground.color} />
      <SearchBar inputValue={searchValue} onChangeInputValue={onChangeSearchValue} />
      <WordList words={filteredWords} navigation={navigation} />
      <AddWordModal navigation={navigation} />
    </SafeAreaView>
  )
}
