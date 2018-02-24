export function setDate(type, payload) {
    return async dispatch => {
        dispatch({ type, payload })
    }
}