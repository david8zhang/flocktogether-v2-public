const UPDATE_TRIP_NAME = 'UPDATE_TRIP_NAME'

export const updateTripName = (tripName: string) => ({
  type: UPDATE_TRIP_NAME,
  payload: tripName,
})

const TripReducer = (state: any = {}, action: any) => {
  switch (action.type) {
    case UPDATE_TRIP_NAME: {
      return { ...state, tripName: action.payload }
    }
    default:
      return state
  }
}

export default TripReducer
