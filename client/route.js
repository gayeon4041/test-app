export default function route(page) {
  switch (page) {
    case '':
      return '/company-main'
    case 'company-main':
      import('./pages/company-main')
      return page
    case 'employee-list':
      import('./pages/main')
      return page

    case 'employee-detail':
      import('./pages/employee-detail')
      return page
  }
}
