export default function route(page) {
  switch (page) {
    case '':
      return '/employee-list'

    case 'employee-list':
      import('./pages/main')
      return page
    case 'employee-detail':
      import('./pages/employee-detail')
      return page
  }
}
