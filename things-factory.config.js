import route from './client/route'
import bootstrap from './client/bootstrap'

export default {
  route,
  routes: [
    {
      tagname: 'employees-main',
      page: 'employees-main'
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
