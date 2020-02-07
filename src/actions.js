// ActonCreator
// For avoiding create action object manually
// - Using this to create actions
// - One more step, if the return object is wrapped
//   by dispatch, then we can remove the step of pass the dispatch
//   e.g.: addTodo = (payload) => dispatch(createAdd(payload))

let idSeq = Date.now()

export function createSet (payload) {
  return {
    type: 'set',
    payload
  }
}

// let's make this action contains logic
// export function createAdd (payload) {
//   return {
//     type: 'add',
//     payload
//   }
// }

// this action returns a function instead of object
// this will enable async feature
export function createAdd (text) {

  // fpr async we need to get the latest state
  return (dispatch, getState) => {
    setTimeout(() => {
      const { todos } = getState()
      if (!todos.find(todo => todo.text === text)) {
        dispatch({
          type: 'add',
          payload: {
            id: ++idSeq,
            text,
            complete: false
          }
        })
      }
    }, 3000)
  }
}

export function createToggle (payload) {
  return {
    type: 'toggle',
    payload
  }
}

export function createRemove (payload) {
  return {
    type: 'remove',
    payload
  }
}
