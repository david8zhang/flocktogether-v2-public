const ADD_TRAVELER = 'ADD_TRAVELER'

export const addTraveler = (payload: {
  name: string
  location: string
  isPlanner: boolean
  userId: string
}) => ({
  type: ADD_TRAVELER,
  payload,
})

const TravelGroupReducer = (state: any[] = [], action: any) => {
  switch (action.type) {
    case ADD_TRAVELER: {
      return state.concat(action.payload)
    }
    default:
      return state
  }
}

export default TravelGroupReducer
