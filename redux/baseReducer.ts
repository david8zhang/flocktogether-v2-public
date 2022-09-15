import { combineReducers } from 'redux'
import TripReducer from './rwidgets/tripWidget'
import TravelGroupReducer from './rwidgets/travelGroupWidget'

export default combineReducers({
  trip: TripReducer,
  travelGroup: TravelGroupReducer,
})
