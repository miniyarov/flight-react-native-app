export async function fetchResult(term) {
    let result = await fetch('https://www.enuygun.com/ucak-bileti/api/v4/airports.json', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'api': '***REMOVED***'
        },
        body: JSON.stringify({
            term
        })
    })

    result = await result.json()

    return result.airports
}

export function setLocation(type, payload) {
    return async dispatch => {
        dispatch({ type, payload })
    }
}