function geocode_link(address) {
  const base_url = 'https://www.google.com/maps/search/?api=1&query='
  const query = encodeURIComponent(address)
  return base_url + query
}
export { geocode_link }
