import React, { useState, useCallback, useRef, useEffect, memo } from 'react';
import { createSet, createAdd, createRemove, createToggle } from './actions'
import reducer from './reducers'
import './App.css';

let idSeq = Date.now()
const storeKey = '__TODOS__'

// bind dispatch with action creators
function bindActionCreators (actionCreators, dispatch) {
  const res = {}

  for (let key in actionCreators) {
    res[key] = function(...args) {
      const actionCreator = actionCreators[key]
      const action = actionCreator(...args)
      dispatch(action)
    }
  }

  return res
}

const Control = memo(function Control (props) {
  const { addTodo } = props
  const inputRef = useRef()
  const onSubmit = e => {
    e.preventDefault()
    const newText = inputRef.current.value.trim()
    if (newText.length === 0) return

    addTodo({
      id: ++idSeq,
      text: newText,
      complete: false
    })

    inputRef.current.value = ''
  }
  return (
    <div className="control">
      <h1>Todos</h1>
      <form onSubmit={onSubmit}>
        <input
          className="new-todo"
          ref={inputRef}
          type="text"
          placeholder="What needs to be done?"
        />
      </form>
    </div>
  )
})

const TodoItem = memo(function TodoItem (props) {
  const { todo: { id, text, complete }, toggleTodo, removeTodo } = props
  const onChange = () => {
    toggleTodo(id)
  }
  const onRemove = () => {
    removeTodo(id)
  }
  return (
    <li>
      <input
        type="checkbox"
        onChange={onChange}
        checked={complete}
      />
      <label>{ text }</label>
      <button onClick={onRemove}>X</button>
    </li>
  )
})

const Todos = memo(function Todos (props) {
  const { todos, removeTodo, toggleTodo } = props
  return (
    <ul>
      {
        todos.map(todo => {
          return <TodoItem
            key={todo.id}
            todo={todo}
            removeTodo={removeTodo}
            toggleTodo={toggleTodo}
          />
        })
      }
    </ul>
  )
})

function App() {

  const [todos, setTodos] = useState([])
  const [incrementCount, setIncrementCount] = useState(0)

  // Let's move all of these operations into dispatch
  // const addTodo = useCallback((todo) => {
  //   setTodos(todos => [...todos, todo])
  // }, [])

  // const removeTodo = useCallback((id) => {
  //   setTodos(todos => todos.filter(todo => todo.id !== id))
  // }, [])

  // const toggleTodo = useCallback((id) => {
  //   setTodos(todos => todos.map(todo => todo.id === id ? {...todo, complete: !todo.complete} : todo))
  // }, [])


  // replace the logic in dispatch
  // receive state and action, return new data after the action
  // this will be replaced by combineReducers
  // function reducer (state, action) {
  //   const { type, payload } = action
  //   const { todos, incrementCount } = state

  //   switch(type) {
  //     case 'set':
  //       return {
  //         ...state,
  //         todos: payload,
  //         incrementCount: incrementCount + 1
  //       }
  //     case 'add':
  //       return {
  //         ...state,
  //         todos: [...todos, payload],
  //         incrementCount: incrementCount + 1
  //       }
  //     case 'remove':
  //       return {
  //         ...state,
  //         todos: todos.filter(todo => todo.id !== payload)
  //       }
  //     case 'toggle':
  //       return {
  //         ...state,
  //         todos: todos.map(todo => todo.id === payload ? {...todo, complete: !todo.complete} : todo)
  //       }
  //     default:
  //   }
  //   return state
  // }


  // We have several operations on todo
  // If we want to track all of the operations, it will be helpful for us the manage the data
  // - one solition is make each operation as an object
  // - create a centerlized function to do the operation
  const dispatch = useCallback(action => {
    const state = { todos, incrementCount }

    const setters = {
      todos: setTodos,
      incrementCount: setIncrementCount
    }

    const newState = reducer(state, action)

    for (let key in newState) {
      setters[key](newState[key])
    }

  }, [todos, incrementCount])

  useEffect(() => {
    const todos = JSON.parse(localStorage.getItem(storeKey) || '[]')

    // Let's do this by dispatch
    // setTodos(todos)
    dispatch(createSet(todos))
  }, [])

  useEffect(() => {
    localStorage.setItem(storeKey, JSON.stringify(todos))
  }, [todos, incrementCount])

  return (
    <div>
      <Control
        {
          ...bindActionCreators({
            addTodo: createAdd
          }, dispatch)
        }
      />
      <Todos
        {
          ...bindActionCreators({
            removeTodo: createRemove,
            toggleTodo: createToggle
          }, dispatch)
        }
        todos={todos}
        dispatch={dispatch}
      />
    </div>
  )
}

export default App;
