import React, { Component } from 'react'
import { CalendarList } from 'react-native-calendars'
import { connect } from 'react-redux'
import moment from 'moment'
import { bindActionCreators } from 'redux'
import * as action from './action'
import { ACTION_UPDATE_RETURN_DATE } from '../SearchScreen/reducer'

const defaultMinDate = moment().format('YYYY-MM-DD')
const defaultMaxDate = moment().add(350, 'days').format('YYYY-MM-DD')

class CalendarScreen extends Component {
    onDayPress(date) {
        this.props.action.setDate(
            this.props.type,
            date.dateString
        )
        console.log(date)
        this.props.navigator.dismissModal()
    }

    render() {
        const { departureDate, returnDate, type } = this.props

        let minDate = defaultMinDate
        let currentDate = departureDate
        if (type === ACTION_UPDATE_RETURN_DATE) {
            minDate = departureDate
            currentDate = returnDate ? returnDate : departureDate
        }

        return (
            <CalendarList
                current={ currentDate }
                // selected={ currentDate }
                pastScrollRange={ 0 }
                futureScrollRange={ 12 }
                minDate={ minDate }
                maxDate={ defaultMaxDate }
                firstDay={ 1 }
                onDayPress={ date => this.onDayPress(date) }
            />
        )
    }
}

const mapStateToProps = (state, props) => ({
    departureDate: state.departureDate,
    returnDate: state.returnDate
})

const mapDispatchToProps = dispatch => ({
    action: bindActionCreators(action, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(CalendarScreen)