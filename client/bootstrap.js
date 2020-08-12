import { store } from '@things-factory/shell'
import employeeList from './reducers/employee-list'

export default function bootstrap() {
  store.addReducers({
    employeeList
  })
}
