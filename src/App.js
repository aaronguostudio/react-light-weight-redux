import React, { useState, useCallback, useRef, useEffect, memo } from 'react';
import { createSet, createAdd, createRemove, createToggle } from './actions'
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
  const { dispatch } = props
  const inputRef = useRef()
  const onSubmit = e => {
    e.preventDefault()
    const newText = inputRef.current.value.trim()
    if (newText.length === 0) return

    dispatch(createAdd({
      id: ++idSeq,
      text: newText,
      complete: false
    }))

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
  const { todo: { id, text, complete }, dispatch } = props
  const onChange = () => {
    dispatch(createToggle(id))
  }
  const onRemove = () => {
    dispatch(createRemove(id))
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
  const { todos, dispatch } = props
  return (
    <ul>
      {
        todos.map(todo => {
          return <TodoItem
            key={todo.id}
            todo={todo}
            dispatch={dispatch}
          />
        })
      }
    </ul>
  )
})

function App() {

  const [ todos, setTodos ] = useState([])

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

  // We have several operations on todo
  // If we want to track all of the operations, it will be helpful for us the manage the data
  // - one solition is make each operation as an object
  // - create a centerlized function to do the operation
  const dispatch = useCallback(action => {
    const { type, payload } = action
    switch (type) {
      case 'set':
        setTodos(payload)
        break
      case 'add':
        setTodos(todos => [...todos, payload])
        break
      case 'toggle':
        setTodos(todos => todos.map(todo => todo.id === payload ? {...todo, complete: !todo.complete} : todo))
        break
      case 'remove':
        setTodos(todos => todos.filter(todo => todo.id !== payload))
        break
      default:

    }
  }, [])

  useEffect(() => {
    const todos = JSON.parse(localStorage.getItem(storeKey) || '[]')

    // Let's do this by dispatch
    // setTodos(todos)
    dispatch(createSet(todos))
  }, [dispatch])

  useEffect(() => {
    localStorage.setItem(storeKey, JSON.stringify(todos))
  }, [todos])

  return (
    <div>
      <Control dispatch={dispatch} />
      <Todos
        todos={todos}
        dispatch={dispatch}
      />
    </div>
  )
}

export default App;
