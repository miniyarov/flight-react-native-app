console.disableYellowBox = true

import { Navigation } from 'react-native-navigation'
import { Provider } from 'react-redux'
import store from './store'
import initialState from './store/initialState'
import registerScreen, {
    SEARCH_SCREEN
} from './screen'

function app() {
    registerScreen(store(initialState), Provider)

    Navigation.startSingleScreenApp({
        screen: {
            screen: SEARCH_SCREEN,
            navigatorStyle: {},
            navigatorButtons: {}
        },
        appStyle: {
            // screenBackgroundColor: 'transparent'
        }
    })
}

app()