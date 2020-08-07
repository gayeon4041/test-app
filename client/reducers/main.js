import { UPDATE_TEST_APP } from '../actions/main'

const INITIAL_STATE = {
  testApp: 'ABC'
}

const testApp = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case UPDATE_TEST_APP:
      return { ...state }

    default:
      return state
  }
}

export default testApp
