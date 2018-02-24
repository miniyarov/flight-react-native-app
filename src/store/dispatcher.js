export default function dispatcher(type, payload) {
    return dispatch => {
        dispatch({
            type,
            payload
        })
    }
}