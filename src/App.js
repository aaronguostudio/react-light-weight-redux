import React, { useState, useCallback, useRef, useEffect, memo } from 'react';
import './App.css';

let idSeq = Date.now()
const storeKey = '__TODOS__'

const Control = memo(function Control (props) {
  const { dispatch } = props
  const inputRef = useRef()
  const onSubmit = e => {
    e.preventDefault()
    const newText = inputRef.current.value.trim()
    if (newText.length === 0) return

    dispatch({
      type: 'add',
      payload: {
        id: ++idSeq,
        text: newText,
        complete: false
      }
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
  const { todo: { id, text, complete }, dispatch } = props
  console.log('>dispatch', dispatch)
  const onChange = () => {
    dispatch({
      type: 'toggle',
      payload: id
    })
  }
  const onRemove = () => {
    dispatch({
      type: 'remove',
      payload: id
    })
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
    dispatch({ type: 'set', payload: todos })
  }, [])

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
