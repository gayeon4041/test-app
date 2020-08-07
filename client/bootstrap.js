import { store } from '@things-factory/shell'
import testApp from './reducers/main'

export default function bootstrap() {
  store.addReducers({
    testApp
  })
}
