import createStore from './createStore'

export const UPDATE_TEXT = 'UPDATE_TEXT'
export const ADD_TODO = 'ADD_TODO'
export const TOGGLE_EDIT_TODO = 'TOGGLE_EDIT_TODO'
export const STOP_EDIT_TODO = 'STOP_EDIT_TODO'
export const TOGGLE_TODO = 'TOGGLE_TODO'
export const UPDATE_TODO = 'UPDATE_TODO'
export const REMOVE_TODO = 'REMOVE_TODO'

const initialState = {
  text: '',
  todos: []
}

const reducer = (state, action) => {
  switch (action.type) {
    case UPDATE_TEXT:
      return {
        ...state,
        text: action.text
      }
    case ADD_TODO:
      return {
        ...state,
        text: '',
        todos: state.todos.concat({
          isEditing: false,
          isComplete: false,
          id: state.todos.length,
          text: action.text
        })
      }

    case TOGGLE_TODO:
      return {
        ...state,
        todos: state.todos.map(
          todo =>
            todo.id === action.id
              ? {
                  ...todo,
                  isComplete: !todo.isComplete
                }
              : todo
        )
      }

    case TOGGLE_EDIT_TODO:
      return {
        ...state,
        todos: state.todos.map(
          todo =>
            todo.id === action.id
              ? {
                  ...todo,
                  isEditing: !todo.isEditing
                }
              : todo
        )
      }

    case STOP_EDIT_TODO:
      return {
        ...state,
        todos: state.todos.map(
          todo =>
            todo.id === action.id
              ? {
                  ...todo,
                  isEditing: false
                }
              : todo
        )
      }

    case UPDATE_TODO:
      return {
        ...state,
        text: '',
        todos: state.todos.map(
          todo =>
            todo.id === action.id
              ? {
                  ...todo,
                  text: action.text
                }
              : todo
        )
      }

    case REMOVE_TODO:
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.id)
      }
    default:
      return state
  }
}

export default createStore(reducer, initialState)
