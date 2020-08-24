import { UPDATE_SELECT_MODE, UPDATE_SELECT_ALL_MODE, RENEWAL_LIST, FUNCTION_LIST } from '../actions/employee-list'

const INITIAL_STATE = {
  selectMode: false,
  selectAll: false,
  needRenewal: false,
  functionObj: {}
}

const employeeList = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case UPDATE_SELECT_MODE:
      return { ...state, selectMode: action.selectMode }

    case UPDATE_SELECT_ALL_MODE:
      return { ...state, selectAll: action.selectAll }

    case RENEWAL_LIST:
      return { ...state, needRenewal: action.needRenewal }

    case FUNCTION_LIST:
      return { ...state, functionObj: action.functionObj }

    default:
      return state
  }
}

export default employeeList
