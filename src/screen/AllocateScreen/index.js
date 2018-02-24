import React, { Component } from 'react'
import {
    Text,
    ScrollView,
    View,
    Image,
    TouchableHighlight
} from 'react-native'
import { BOOK_SCREEN } from '../../screen'

export default class AllocateScreen extends Component {
    renderPrice(prices) {
        let views = []
        Object.keys(prices).forEach(key => {
            let price = prices[key]
            views.push(
                <View key={ key } style={ { padding: 10, flexDirection: 'row' } }>
                    <Text style={ { flex: 1 } }>{ price.count } { price.type_description }</Text>
                    <Text style={ { flex: 1, textAlign: 'right' } }>{ price.base } TL</Text>
                    <Text style={ { flex: 1, textAlign: 'right' } }>{ price.tax } TL</Text>
                    <Text style={ { flex: 1, textAlign: 'right' } }>{ price.service } TL</Text>
                </View>
            )
        })

        return views
    }

    renderSegment(segment, index, isPromo) {
        return [
            (segment.segment_delay ? <Text
                key={ 'text' + index }
                style={ {
                    color: 'gray',
                    fontSize: 13,
                    alignSelf: 'center',
                    paddingTop: 5,
                    paddingBottom: 5
                } }>Aktarma: { segment.segment_delay.hour > 0 ? segment.segment_delay.hour + 'sa' : '' } { segment.segment_delay.minute }dk
                bekleme</Text> : null),
            <View key={ 'view' + index } style={ { flexDirection: 'row', paddingBottom: 10, alignItems: 'center' } }>
                <Image style={ { marginRight: 5, width: 25, height: 25 } }
                       source={ { uri: segment.marketing_airline.image } }/>
                <View style={ { flex: 1 } }>
                    <View style={ { flexDirection: 'row', justifyContent: 'space-between' } }>
                        <Text>{ segment.marketing_airline.name }</Text>
                        <Text style={ { alignSelf: 'center' } }>{ segment.flight_number }</Text>
                    </View>
                    <Text style={ { color: 'gray', fontSize: 13 } }>{ isPromo && 'Promosyonlu, ' }Sınıf: Ekonomi
                        ({ segment.class })</Text>
                </View>
            </View>,
            <View key={ 'view2' + index } style={ { flexDirection: 'row' } }>
                <Text style={ { marginRight: 5, width: 25 } }></Text>
                <View>
                    <View style={ { flexDirection: 'row', paddingRight: 50, paddingBottom: 5 } }>
                        <Text style={ { fontWeight: 'bold' } }>Kalkış: </Text>
                        <Text style={ { textDecorationLine: 'underline', textAlign: 'justify' } } numberOfLines={ 2 }>
                            { segment.departure_datetime.date }, { segment.departure_datetime.time } - { segment.origin.city_name } ({ segment.origin.airport_name })
                        </Text>
                    </View>
                    <View style={ { flexDirection: 'row', paddingRight: 10 } }>
                        <Text style={ { fontWeight: 'bold' } }>Varış: </Text>
                        <Text style={ { textDecorationLine: 'underline', textAlign: 'justify' } } numberOfLines={ 2 }>
                            { segment.arrival_datetime.date }, { segment.arrival_datetime.time } - { segment.destination.city_name } ({ segment.destination.airport_name })
                        </Text>
                    </View>
                </View>
            </View>
        ]
    }

    renderFlight(flight, index) {
        return [
            <Text key={ 'text' + index } style={ {
                fontSize: 16,
                padding: 10,
                backgroundColor: 'green',
                color: 'white'
            } }>{ flight.segments[0].type === 'departure' ? 'Gidiş' : 'Dönüş' }</Text>,
            <View key={ 'view' + index } style={ { padding: 10 } }>
                { flight.segments.map((segment, index) => this.renderSegment(segment, index, flight.infos.is_promo)) }
                <View style={ {
                    paddingTop: 10,
                    flexDirection: 'row',
                    justifyContent: 'space-between'
                } }>
                    <View style={ { flexDirection: 'row', alignItems: 'center' } }>
                        <Text style={ {
                            marginRight: 5,
                            width: 25
                        } }></Text>
                        <Text style={ {
                            fontSize: 12,
                            color: 'gray'
                        } }>Uçuş süresi: { flight.infos.duration.hour }sa { flight.infos.duration.minute }dk</Text>
                    </View>
                    { /*<View style={ { flexDirection: 'row', alignItems: 'center' } }>*/ }
                    { /*<Text></Text>*/ }
                    { /*<Text style={ { fontSize: 11, color: 'gray' } }> Uçuş Kuralları</Text>*/ }
                    { /*</View>*/ }
                </View>
                { flight.infos.is_promo && <Text style={ { paddingTop: 10, fontSize: 12, color: 'gray' } }>
                    * Bu bilet özel fiyatlı bir promosyon bilettir. Bu nedenle bilette iptal, iade ve değişiklik
                    yapılamaz.
                </Text> }
            </View>
        ]
    }

    onBook() {
        const { navigator, detail } = this.props

        navigator.push({
            screen: BOOK_SCREEN,
            title: 'Yolcu Bilgileri',
            backButtonTitle: '',
            passProps: {
                requestId: detail.request_id,
                passengers: detail.prices.passenger_fares
            }
        })
    }

    render() {
        const { detail } = this.props

        return (
            <View style={ { flex: 1, marginBottom: 20 } }>
                <ScrollView>
                    <Text style={ {
                        fontSize: 16,
                        padding: 10,
                        backgroundColor: 'green',
                        color: 'white'
                    } }>Fiyat</Text>
                    <View style={ {
                        padding: 10,
                        paddingBottom: 0,
                        flexDirection: 'row',
                        justifyContent: 'space-between'
                    } }>
                        <Text style={ { flex: 1 } }>Yolcu</Text>
                        <Text style={ { flex: 1, textAlign: 'right' } }>Fiyat</Text>
                        <Text style={ { flex: 1, textAlign: 'right' } }>Vergi/Fiyat</Text>
                        <Text style={ { flex: 1, textAlign: 'right' } }>Hizmet</Text>
                    </View>
                    { this.renderPrice(detail.prices.passenger_fares) }
                    <Text style={ { padding: 10, alignSelf: 'flex-end' } }>Toplam ücret: <Text
                        style={ {
                            color: 'green',
                            fontWeight: 'bold',
                            fontSize: 16
                        } }>{ detail.prices.grand_total } TL</Text></Text>
                    { detail.flights.map((flight, index) => this.renderFlight(flight, index)) }
                </ScrollView>
                <TouchableHighlight
                    onPress={ () => this.onBook() }
                    underlayColor={ 'transparent' }
                    style={ {
                        alignItems: 'center',
                        margin: 5,
                        padding: 10,
                        backgroundColor: 'green',
                        borderRadius: 10
                    } }>
                    <Text style={ {
                        color: 'white',
                        fontSize: 18,
                        fontWeight: 'bold'
                    } }>Satın Al</Text>
                </TouchableHighlight>
            </View>
        )
    }
}