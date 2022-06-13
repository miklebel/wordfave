import moment from 'moment'
import uuid from 'react-native-uuid'
import { sendWoopraEvent } from '../services/Woopra'

export const ADD_WORD = 'ADD_WORD'
export const EDIT_WORD = 'EDIT_WORD'
export const REMOVE_WORD = 'REMOVE_WORD'
export const ADD_CATEGORY = 'ADD_CATEGORY'
export const REMOVE_CATEGORY = 'REMOVE_CATEGORY'
export const ASSIGN_CATEGORY = 'ASSIGN_CATEGORY'

export const addWord =
  ({ data }) =>
  async dispatch => {
    const date = moment().format()
    const id = uuid.v4()
    const newWord = { id, data, date }
    await sendWoopraEvent({ eventName: ADD_WORD, eventData: JSON.stringify(data) })

    dispatch({
      type: ADD_WORD,
      payload: newWord
    })
  }

export const editWord =
  ({ id, data }) =>
  async dispatch => {
    dispatch({
      type: EDIT_WORD,
      payload: { id, data }
    })
  }

export const removeWord =
  ({ id }) =>
  async dispatch => {
    dispatch({
      type: REMOVE_WORD,
      payload: { id }
    })
  }

export const addCategory =
  ({ data }) =>
  dispatch => {
    const id = uuid.v4()
    const newCategory = { id, data }
    dispatch({
      type: ADD_CATEGORY,
      payload: newCategory
    })
    return id
  }

export const removeCategory =
  ({ id }) =>
  dispatch => {
    dispatch({
      type: REMOVE_CATEGORY,
      payload: { id }
    })
  }

export const assignCategory =
  ({ wordId, categoryId }) =>
  dispatch => {
    dispatch({
      type: ASSIGN_CATEGORY,
      payload: { wordId, categoryId }
    })
  }
