export async function fetchResult(
    origin,
    destination,
    departureDate,
    returnDate,
    passengers,
    cabinClass,
    nonStop
) {
    if (returnDate) {
        returnDate = returnDate.split('-').reverse().join('-')
    }

    let result = await fetch('https://www.enuygun.com/ucak-bileti/api/v4/search.json', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'api': '***REMOVED***'
        },
        body: JSON.stringify({
            origin: origin.id,
            destination: destination.id,
            departure: departureDate.split('-').reverse().join('-'),
            return: returnDate,
            adult: passengers.adult,
            child: passengers.child,
            infant: passengers.infant,
            senior: passengers.senior,
            student: passengers.student,
            class: cabinClass
        })
    })

    // console.log(result._bodyText)

    result = await result.json()

    return result
}