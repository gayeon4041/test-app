export default function route(page) {
  switch (page) {
    case '':
      return '/test-app-main'

    case 'test-app-main':
      import('./pages/main')
      return page
  }
}
