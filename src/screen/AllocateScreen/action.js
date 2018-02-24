export async function allocateResult(requestId, departureSelected, flight) {
    let itineraries = []

    if (departureSelected) {
        itineraries.push(departureSelected.enuid)
    }

    itineraries.push(flight.enuid)

    let result = await fetch('https://www.enuygun.com/ucak-bileti/api/v4/detail.json', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'api': '***REMOVED***'
        },
        body: JSON.stringify({
            request_id: requestId,
            itineraries,
            version: 2
        })
    })

    result = await result.json()

    return result.detail
}