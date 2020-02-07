// ActonCreator
// For avoiding create action object manually
// - Using this to create actions
// - One more step, if the return object is wrapped
//   by dispatch, then we can remove the step of pass the dispatch
//   e.g.: addTodo = (payload) => dispatch(createAdd(payload))

export function createSet (payload) {
  return {
    type: 'set',
    payload
  }
}

export function createAdd (payload) {
  return {
    type: 'add',
    payload
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
