import moment from 'moment/moment'

const initialDepartureDate = moment().add(1, 'days').format('YYYY-MM-DD')

export default {
    origin: {
        id: 'Kalkış',
        label: 'Şehir / Havalimanı'
    },
    destination: {
        id: 'Varış',
        label: 'Şehir / Havalimanı'
    },
    departureDate: initialDepartureDate,
    returnDate: null,
    passengers: {
        adult: 1,
        senior: 0,
        student: 0,
        child: 0,
        infant: 0
    },
    cabinClass: 'ekonomi',
    result: {}
}