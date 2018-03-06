import initialState from '../../store/initialState'

export const ACTION_UPDATE_ORIGIN = 'ACTION_UPDATE_ORIGIN'
export const ACTION_UPDATE_DESTINATION = 'ACTION_UPDATE_DESTINATION'
export const ACTION_UPDATE_DEPARTURE_DATE = 'ACTION_UPDATE_DEPARTURE_DATE'
export const ACTION_UPDATE_RETURN_DATE = 'ACTION_UPDATE_RETURN_DATE'
export const ACTION_UPDATE_PASSENGERS = 'ACTION_UPDATE_PASSENGERS'
export const ACTION_UPDATE_CABIN_CLASS = 'ACTION_UPDATE_CABIN_CLASS'

export const origin = (state = initialState.origin, action) => {
    switch (action.type) {
        case ACTION_UPDATE_ORIGIN:
            return { ...action.payload }
        default:
            return state
    }
}

export const destination = (state = initialState.destination, action) => {
    switch (action.type) {
        case ACTION_UPDATE_DESTINATION:
            return { ...action.payload }
        default:
            return state
    }
}

export const departureDate = (state = initialState.departureDate, action) => {
    switch (action.type) {
        case ACTION_UPDATE_DEPARTURE_DATE:
            return action.payload
        default:
            return state
    }
}

export const returnDate = (state = null, action) => {
    switch (action.type) {
        case ACTION_UPDATE_RETURN_DATE:
            return action.payload
        default:
            return state
    }
}

export const passengers = (state = initialState.passengers, action) => {
    switch (action.type) {
        case ACTION_UPDATE_PASSENGERS:
            return { ...action.payload }
        default:
            return state
    }
}

export const cabinClass = (state = initialState.cabinClass, action) => {
    switch (action.type) {
        case ACTION_UPDATE_CABIN_CLASS:
            return action.payload
        default:
            return state
    }
}