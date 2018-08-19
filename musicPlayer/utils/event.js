/**
 * Created by justin on 2018/5/13.
 */
let events = {}

function on(name, self, callback) {
  let tuple = [self, callback]
  let callbacks = events[name]
  if (Array.isArray(callbacks)) {
    callbacks.push(tuple)
  } else {
    events[name] = [tuple]
  }
}

function remove(name) {
  return new Promise((resolve, reject) => {
    events[name] = []
    resolve()
  })
}

function emit(name, data) {
  let callbacks = events[name]
  if (Array.isArray(callbacks)) {
    callbacks.map((tuple) => {
      let self = tuple[0]
      let callback = tuple[1]
      callback.call(self, data)
    })
  }
}

export default {
  on: on,
  remove: remove,
  emit: emit,
  names: {
    EVENT_ADD_QUESTION: 'EVENT_ADD_QUESTION',
    EVENT_POST_QUESTION_SUCCESS: 'EVENT_POST_QUESTION_SUCCESS',
    EVENT_DRAFT_CHANGE: 'EVENT_DRAFT_CHANGE'
  }
}
