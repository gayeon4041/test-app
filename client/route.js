export default function route(page) {
  switch (page) {
    case '':
      return '/company-main'
    case 'company-main':
      import('./pages/company-main')
      return page
    case 'employees-main':
      import('./pages/employees-main')
      return page

    case 'employee-detail':
      import('./pages/employee-detail')
      return page
  }
}
