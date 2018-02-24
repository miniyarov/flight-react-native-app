import React, { Component } from 'react'
import {
    View,
    Text,
    TouchableHighlight,
    Image
} from 'react-native'

export default class FlightRow extends Component {
    renderBaggage(baggage) {
        if (baggage) {
            return (
                <Text>{ baggage.allowance } kg/kişi</Text>
            )
        }

        return (
            <Text>Sadece el bagajı</Text>
        )
    }

    render() {
        const { flight, airlines, airports, onSelect } = this.props

        return [
            <View style={ { flexDirection: 'row', alignItems: 'center', padding: 5 } }>
                <Image style={ { marginRight: 5, width: 25, height: 25 } }
                       source={ { uri: airlines[flight.segments[0].marketing_airline].image } }/>
                <Text style={ {
                    fontSize: 16,
                    fontWeight: 'bold'
                } }>{ airlines[flight.segments[0].marketing_airline].name }</Text>
            </View>,
            <View style={ {
                flexDirection: 'row',
                justifyContent: 'space-between',
                padding: 5,
                borderBottomColor: 'rgba(0,0,0,0.1)',
                borderBottomWidth: 1
            } }>
                <View style={ { flex: 1 } }>
                    <Text>{ flight.segments.map((segment, key) => {
                        let iata = ' > ' + segment.destination

                        if (key === 0) {
                            iata = segment.origin + iata
                        }

                        return iata
                    }) }
                    </Text>
                    { this.renderBaggage(flight.infos.baggage_info.firstBaggageCollection[0]) }
                </View>
                <View style={ { flex: 1 } }>
                    <Text style={ { fontWeight: 'bold' } }>
                        { flight.segments[0].departure_datetime.time }
                    </Text>
                    <Text>
                        { flight.segments[0].duration.hour }sa { flight.segments[0].duration.minute }dk
                    </Text>
                    <Text>
                        { flight.infos.is_promo && 'Promosyonlu' }
                    </Text>
                </View>
                <View style={ { justifyContent: 'space-between' } }>
                    <Text
                        style={ { fontSize: 18, fontWeight: 'bold' } }>
                        { flight.average_price } { flight.price_currency }
                    </Text>
                    <Text>
                        { flight.detail_price } { flight.price_currency }
                    </Text>
                    <TouchableHighlight
                        onPress={ () => onSelect(flight) }
                        underlayColor={ 'transparent' }>
                        <View style={ { padding: 2, borderWidth: 1, borderColor: 'rgba(0,0,0,0.5)', borderRadius: 5 } }>
                            <Text>Select</Text>
                        </View>
                    </TouchableHighlight>
                </View>
            </View>
        ]
    }
}