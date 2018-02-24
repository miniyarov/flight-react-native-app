export async function bookResult(requestId, passengers, contact) {
    let result = await fetch('https://www.enuygun.com/ucak-bileti/api/v4/book.json', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'api': '***REMOVED***'
        },
        body: JSON.stringify({
            request_id: requestId,
            passengers,
            contact
        })
    })

    // console.log(result)

    result = await result.json()

    return result
}