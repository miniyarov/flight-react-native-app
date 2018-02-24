export const result = (state = {}, action) => {
    switch (action.type) {
        case 'RESULT_RECEIVED':
            return action.result
        default:
            return state
    }
}