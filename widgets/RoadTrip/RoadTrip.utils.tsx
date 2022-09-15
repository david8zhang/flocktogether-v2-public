const proxyUrl = 'https://lit-tor-73201.herokuapp.com/'
const radius = 50000

export const fetchPlaceAutocomplete = (
  term: string,
  location?: { lat: number; lng: number }
): Promise<any> => {
  let apiUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${term}&key=${GOOGLE_API_KEY}`
  if (location) {
    apiUrl += `&location=${location.lat},${location.lng}`
    apiUrl += `&radius=${radius}`
  }
  return fetch(`${proxyUrl}${apiUrl}`)
    .then((res) => {
      if (res.ok) {
        return res.json()
      }
    })
    .then((data) => data)
    .catch((err) => {
      console.error('Error!', err)
    })
}

export const fetchPlaceDetails = (placeId: string): Promise<any> => {
  const apiUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${GOOGLE_API_KEY}`
  return fetch(`${proxyUrl}${apiUrl}`)
    .then((res) => {
      if (res.ok) {
        return res.json()
      }
    })
    .then((data) => data)
    .catch((err) => {
      console.error('Error!', err)
    })
}

export const searchPlaces = (
  searchTerm: string,
  location?: { lat: number; lng: number }
): Promise<any> => {
  let apiUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?key=${GOOGLE_API_KEY}&query=${searchTerm}`
  apiUrl += '&fields=business_status,formatted_address,geometry,name,place_id,types'
  if (location) {
    const { lat, lng } = location
    apiUrl += `&location=${lat},${lng}&rankby=distance`
  }
  return fetch(`${proxyUrl}${apiUrl}`)
    .then((res) => {
      if (res.ok) {
        return res.json()
      }
    })
    .then((data) => data)
    .catch((err) => {
      console.error('Error!', err)
    })
}

export const getCurrentTraveler = (travelGroup: any[], userId: string | string[]) => {
  if (!travelGroup || !userId) {
    return null
  }
  return travelGroup.find((traveler: any) => traveler.userId === userId)
}
