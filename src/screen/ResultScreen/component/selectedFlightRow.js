import React, { Component } from 'react'
import {
    View,
    Text,
    TouchableHighlight
} from 'react-native'

export default class SelectedFlightRow extends Component {
    render() {
        const { flight, airlines } = this.props

        return (
            <View style={ { padding: 5, backgroundColor: 'rgba(0,0,0,0.1)' } }>
                <View style={ { flexDirection: 'row', justifyContent: 'space-between' } }>
                    <Text style={ { fontWeight: 'bold' } }>Gidiş uçuşunuz: <Text
                        style={ { fontWeight: 'normal' } }>{ flight.segments[0].departure_datetime.date }</Text></Text>
                    <Text>{ airlines[flight.segments[0].marketing_airline].name }</Text>
                </View>
                <View style={ { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 5 } }>
                    <Text>{ flight.segments[0].departure_datetime.time } { flight.segments[0].origin }</Text>
                    <Text> &rarr; </Text>
                    <Text>{ flight.segments[0].departure_datetime.time } { flight.segments[0].origin }</Text>
                    <Text>{ flight.price } { flight.price_currency }</Text>
                </View>
            </View>
        )
    }
}