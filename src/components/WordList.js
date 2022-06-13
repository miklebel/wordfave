import React, { useEffect } from 'react'
import { Text, StyleSheet, SectionList, View, Platform } from 'react-native'
import { useSelector } from 'react-redux'
import Icon from 'react-native-vector-icons/MaterialIcons'
import moment from 'moment'
import { Colors } from '../styles'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { sendWoopraEvent } from '../services/Woopra'

export const WordList = ({ words, navigation }) => {
  const datedWords = words
    .sort((a, b) => moment(b.date).diff(moment(a.date)))
    .map(word => {
      return {
        ...word,
        namedDate: moment(word.date).calendar(null, {
          sameDay: '[Today]',
          lastDay: '[Yesterday]',
          lastWeek: 'LL',
          sameElse: 'LL'
        })
        // @ts-ignore
      }
    })

  let wordsGroup = datedWords.reduce((red, acc) => {
    red[acc.namedDate] = [...(red[acc.namedDate] || []), acc]
    return red
  }, {})

  const normalizedGroup = Object.entries(wordsGroup).map(group => {
    return { title: group[0], data: group[1] }
  })

  const EmptyComponent = () => {
    // @ts-ignore
    const { words } = useSelector(state => state.wordsReducer)
    const wordsExist = words.length
    return (
      <Text style={styles.emptyComponentText}>
        {!wordsExist
          ? `Add your first word by pressing the blue "plus" button.`
          : `This word is not in your collection yet. Add a new word by pressing the blue "plus" button.`}
      </Text>
    )
  }

  return (
    <SectionList
      ListEmptyComponent={EmptyComponent}
      style={{ width: '100%' }}
      sections={normalizedGroup}
      keyExtractor={(item, index) => item + index}
      ItemSeparatorComponent={() => <View style={styles.wordSeparator} />}
      renderItem={({ item, section: { title } }) => (
        <Word
          navigation={navigation}
          title={item.data.title}
          definition={item.data.definition}
          categoryId={item.data.categoryId}
          id={item.id}
          date={title}
        />
      )}
      renderSectionHeader={({ section: { title } }) => (
        <View style={styles.sectionContainer}>
          <Text style={styles.header}>{title}</Text>
        </View>
      )}
    />
  )
}

const Word = ({ title, definition, categoryId, id, navigation, date }) => {
  const partOfSpeech = definition.match(/\[([^)]+)\]/)

  const shortenText = (str, limit) => {
    if (str.length <= limit) return str
    return str.substr(0, str.lastIndexOf(' ', limit)) + '...'
  }
  return (
    <TouchableOpacity
      style={styles.wordContainer}
      onPress={() => {
        navigation.navigate('WordDetails', { id, date })
        sendWoopraEvent({ eventData: title, eventName: 'WORD_OPEN' })
      }}
    >
      <Text style={styles.wordTitle}>{title}</Text>
      <CategoryChip id={categoryId} />
      <Text style={styles.wordDescription}>
        <Text style={{ fontWeight: 'bold', color: Colors.blue.color }}>{`${
          partOfSpeech?.[1] ? partOfSpeech?.[1] + '  ' : ''
        }`}</Text>
        {shortenText(`${definition.replace(partOfSpeech?.[0], '')}`, 40)}
      </Text>
      <Icon style={styles.actionIcon} name="navigate-next" />
    </TouchableOpacity>
  )
}

export const CategoryChip = ({ id, button = false }) => {
  const getContrastYIQ = hexcolor => {
    const r = parseInt(hexcolor.substr(1, 2), 16)
    const g = parseInt(hexcolor.substr(4, 2), 16)
    const b = parseInt(hexcolor.substr(5, 2), 16)
    const yiq = (r * 299 + g * 587 + b * 114) / 1000
    return yiq >= 90 ? 'black' : 'white'
  }
  // @ts-ignore
  const { categories } = useSelector(state => state.wordsReducer)
  const category = categories.find(category => category.id === id)
  if (category) {
    const { name, color } = category.data

    return (
      <View
        style={{
          justifyContent: 'flex-start',
          flexDirection: 'row',
          marginRight: 8
        }}
      >
        <View style={{ ...styles.categoryChipContainer, backgroundColor: color }}>
          <Text style={{ ...styles.categoryChipText, color: getContrastYIQ(color) }}>{name.toUpperCase()}</Text>
        </View>
      </View>
    )
  } else if (button) {
    return (
      <View
        style={{
          justifyContent: 'flex-start',
          flexDirection: 'row',
          marginRight: 8
        }}
      >
        <View
          style={{
            ...styles.categoryChipContainer,
            backgroundColor: Colors.blue.color
          }}
        >
          <Icon
            name="add"
            style={{
              ...styles.categoryChipText,
              color: 'white',
              paddingTop: 2,
              marginRight: -5,
              fontSize: 17
            }}
          />
          <Text style={{ ...styles.categoryChipText, color: 'white' }}>CATEGORY</Text>
        </View>
      </View>
    )
  } else {
    return (
      <View
        style={{
          justifyContent: 'flex-start',
          flexDirection: 'row',
          marginRight: 8
        }}
      >
        <View
          style={{
            ...styles.categoryChipContainer,
            borderColor: 'white',
            height: 22,
            borderWidth: 1,
            opacity: 0.3
          }}
        >
          <Text
            style={{
              ...styles.categoryChipText,
              color: 'white'
            }}
          >
            NO CATEGORY
          </Text>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8
  },
  header: {
    fontSize: 16,
    lineHeight: 22,
    letterSpacing: 0.4,
    fontWeight: '400',
    opacity: 0.38,
    color: 'white',
    paddingLeft: 24
  },
  wordContainer: {
    padding: 12,
    backgroundColor: Colors.secondaryBackground.color,
    width: '100%',
    justifyContent: 'center',
    paddingLeft: 24
  },
  wordTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
    lineHeight: 22,
    letterSpacing: 0.4
  },
  sectionContainer: {
    backgroundColor: Colors.primaryBackground.color,
    width: '100%',
    height: 36,
    justifyContent: 'center'
  },
  categoryChipContainer: {
    flexDirection: 'row',
    marginTop: 8,
    justifyContent: 'center',
    borderRadius: 4,
    height: 20
  },
  categoryChipText: {
    marginTop: 2,
    paddingTop: Platform.OS === 'android' ? 2.5 : 0,
    fontWeight: '400',
    paddingLeft: 8,
    marginRight: 8,
    fontSize: 12,
    lineHeight: 14.5,
    letterSpacing: 0.3
  },
  wordDescription: {
    marginTop: 8,
    fontSize: 16,
    color: 'white',
    letterSpacing: 0.4,
    fontWeight: '400'
  },
  wordSeparator: {
    height: 1,
    backgroundColor: '#979797',
    opacity: 0.4
  },
  actionIcon: {
    color: 'white',
    fontSize: 30,
    position: 'absolute',
    right: 24
  },
  emptyComponentText: {
    opacity: 0.7,
    fontSize: 20,
    textAlign: 'center',
    color: 'white',
    marginTop: 250,
    padding: 24
  }
})
