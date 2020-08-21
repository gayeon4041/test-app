export function getURLinfo(key) {
  const location = new URL(window.location)
  return location.searchParams.get(key)
}
