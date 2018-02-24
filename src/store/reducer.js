import { combineReducers } from 'redux'
import { result } from '../screen/ResultScreen/reducer'
import { origin, destination, departureDate, returnDate, passengers, cabinClass } from '../screen/SearchScreen/reducer'

export default combineReducers({
    origin,
    destination,
    departureDate,
    returnDate,
    passengers,
    cabinClass,
    result
})