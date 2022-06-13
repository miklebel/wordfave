import { sendWoopraEvent } from '../services/Woopra'
import { ADD_CATEGORY, ADD_WORD, REMOVE_WORD, REMOVE_CATEGORY, EDIT_WORD, ASSIGN_CATEGORY } from './actions'

const initialState = {
  words: [],
  categories: []
}

export const wordsReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_WORD:
      return { ...state, words: [...state.words, action.payload] }
    case REMOVE_WORD:
      return {
        ...state,
        words: state.words.filter(word => word.id !== action.payload.id)
      }
    case EDIT_WORD:
      let { words } = state
      const { id, data } = action.payload
      return {
        ...state,
        words: words.map(word => {
          if (word.id === id) {
            return { ...word, data: { ...word.data, ...data } }
          } else {
            return word
          }
        })
      }
    case ADD_CATEGORY:
      return { ...state, categories: [...state.categories, action.payload] }
    case REMOVE_CATEGORY:
      return {
        ...state,
        categories: state.categories.filter(category => category.id !== action.payload.id),
        words: state.words.map(word => {
          if (word.data.categoryId === action.payload.id) {
            return { ...word, data: { ...word.data, categoryId: '' } }
          } else {
            return word
          }
        })
      }
    case ASSIGN_CATEGORY:
      const { categoryId, wordId } = action.payload
      sendWoopraEvent({
        eventName: action.type,
        eventData: JSON.stringify({
          word: state.words.find(word => word.id === wordId).data.title,
          category: state.categories.find(category => category.id === categoryId).data.name
        })
      })
      const newWords = state.words.map(word => {
        if (word.id === wordId) {
          word.data.categoryId = categoryId
        }
        return word
      })
      return { ...state, words: newWords }
    default:
      return state
  }
}

wordsReducer
