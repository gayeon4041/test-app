import { UPDATE_SELECT_MODE, UPDATE_DETAIL_INFO } from '../actions/employee-list'

const INITIAL_STATE = {
  selectMode: false,
  detailInfo: {}
}

const employeeList = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case UPDATE_SELECT_MODE:
      return { ...state, selectMode: action.selectMode }

    case UPDATE_DETAIL_INFO:
      return { ...state, detailInfo: action.detailInfo }

    default:
      return state
  }
}

export default employeeList
