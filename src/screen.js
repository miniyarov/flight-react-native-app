import { Navigation } from 'react-native-navigation'

import SearchScreen from './screen/SearchScreen'
import LocationSearchScreen from './screen/LocationSearchScreen'
import CalendarScreen from './screen/CalendarScreen'
import ResultScreen from './screen/ResultScreen'
import AllocateScreen from './screen/AllocateScreen'
import BookScreen from './screen/BookScreen'
import PaymentScreen from './screen/PaymentScreen'

export const SEARCH_SCREEN = 'SEARCH_SCREEN'
export const LOCATION_SEARCH_SCREEN = 'LOCATION_SEARCH_SCREEN'
export const CALENDAR_SCREEN = 'CALENDAR_SCREEN'
export const RESULT_SCREEN = 'RESULT_SCREEN'
export const ALLOCATE_SCREEN = 'ALLOCATE_SCREEN'
export const BOOK_SCREEN = 'BOOK_SCREEN'
export const PAYMENT_SCREEN = 'PAYMENT_SCREEN'

export default function (store, Provider) {
    Navigation.registerComponent(SEARCH_SCREEN, () => SearchScreen, store, Provider)
    Navigation.registerComponent(LOCATION_SEARCH_SCREEN, () => LocationSearchScreen, store, Provider)
    Navigation.registerComponent(CALENDAR_SCREEN, () => CalendarScreen, store, Provider)
    Navigation.registerComponent(RESULT_SCREEN, () => ResultScreen, store, Provider)
    Navigation.registerComponent(ALLOCATE_SCREEN, () => AllocateScreen, store, Provider)
    Navigation.registerComponent(BOOK_SCREEN, () => BookScreen, store, Provider)
    Navigation.registerComponent(PAYMENT_SCREEN, () => PaymentScreen, store, Provider)
}