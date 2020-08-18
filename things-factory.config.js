import route from './client/route'
import bootstrap from './client/bootstrap'

export default {
  route,
  routes: [
    {
      tagname: 'test-app-main',
      page: 'employee-list'
    },
    {
      tagname: 'employee-detail',
      page: 'employee-detail'
    },
    {
      tagname: 'company-main',
      page: 'company-main'
    }
  ],
  bootstrap
}
