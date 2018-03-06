import React, { Component } from 'react'
import {
    ScrollView,
    View,
    Text,
    Switch,
    TouchableHighlight,
    Alert
} from 'react-native'
import moment from 'moment'
import { connect } from 'react-redux'
import { CALENDAR_SCREEN, LOCATION_SEARCH_SCREEN, RESULT_SCREEN } from '../../screen'
import {
    ACTION_UPDATE_DEPARTURE_DATE,
    ACTION_UPDATE_DESTINATION,
    ACTION_UPDATE_ORIGIN,
    ACTION_UPDATE_RETURN_DATE
} from './reducer'
import PassengerModal, { CABIN_MAP, CABIN_MAP_ID } from './component/passengerModal'

class SearchScreen extends Component {
    constructor(props) {
        super(props)

        this.state = {
            returnDate: props.returnDate,
            nonStop: false,
            passengerModalVisible: false
        }
    }

    search() {
        const { navigator, origin, destination, departureDate, passengers, cabinClass } = this.props
        const { returnDate, nonStop } = this.state

        if (origin.id.length > 4 || destination.id.length > 4) {
            Alert.alert('Oops!', 'Please select destinations')
        } else {
            navigator.push({
                screen: RESULT_SCREEN,
                title: 'Gidiş Uçuşunu Seçin',
                backButtonTitle: '',
                passProps: {
                    origin,
                    destination,
                    departureDate,
                    returnDate,
                    passengers,
                    cabinClass,
                    nonStop
                }
            })
        }
    }

    onLocationSearch(type) {
        this.props.navigator.showModal({
            screen: LOCATION_SEARCH_SCREEN,
            title: type === ACTION_UPDATE_ORIGIN ? 'Nereden' : 'Nereye',
            passProps: {
                type
            }
        })
    }

    onCalendarList(type) {
        this.props.navigator.showModal({
            screen: CALENDAR_SCREEN,
            title: type === ACTION_UPDATE_DEPARTURE_DATE ? 'Gidiş tarihi' : 'Dönüş tarihi',
            passProps: {
                type
            }
        })
    }

    onToggleRoundtrip(mode) {
        const { departureDate, returnDate } = this.props

        if (mode === 1) {
            this.setState({
                returnDate: returnDate ? returnDate : departureDate
            })
        } else {
            this.setState({
                returnDate: null
            })
        }
    }

    onTogglePassengerModal(passengerModalVisible) {
        this.setState({
            passengerModalVisible
        })
    }

    componentWillReceiveProps(nextProps) {
        // returnDate changes through redux
        if (nextProps.returnDate !== this.state.returnDate) {
            this.setState({
                returnDate: nextProps.returnDate
            })
        }
    }

    countTotalPassengers() {
        const { passengers } = this.props

        return passengers['adult'] + passengers['child'] + passengers['senior'] + passengers['student'] + passengers['infant']
    }

    render() {
        const { origin, destination, departureDate, cabinClass } = this.props
        const { returnDate, nonStop } = this.state
        const departureMoment = moment(departureDate)

        let returnContainer = (
            <View style={ { justifyContent: 'center', alignItems: 'center' } }>
                <Text>Tek Yön</Text>
            </View>
        )

        if (returnDate) {
            let returnMoment = moment(returnDate)
            if (returnMoment.isBefore(departureMoment)) {
                returnMoment = departureMoment
            }

            returnContainer = (
                <View style={ { justifyContent: 'center', alignItems: 'center' } }>
                    <Text>Dönüş Tarihi</Text>
                    <Text style={ { fontSize: 25, fontWeight: '800' } }>{ returnMoment.date() }</Text>
                    <Text>{ returnMoment.format('MMMM') }, { returnMoment.format('dddd') }</Text>
                </View>
            )
        }

        return (
            <ScrollView style={ { flex: 1, backgroundColor: 'rgba(0,0,0,0.1)' } }>
                <Text style={ {
                    margin: 10,
                    fontSize: 20,
                    fontWeight: 'bold',
                    alignSelf: 'center'
                } }>
                    Uçak Bileti, Ucuz Uçak Bileti
                </Text>
                <View style={ {
                    borderWidth: 1,
                    margin: 10,
                    padding: 10,
                    backgroundColor: 'white',
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    alignItems: 'stretch'
                } }>
                    <TouchableHighlight
                        style={ { flex: 0.45, borderWidth: 1, justifyContent: 'center', alignItems: 'center' } }
                        onPress={ () => this.onLocationSearch(ACTION_UPDATE_ORIGIN) }
                        underlayColor={ 'transparent' }>
                        <View style={ { justifyContent: 'center', alignItems: 'center' } }>
                            <Text style={ { color: 'gray' } }>Nereden</Text>
                            <Text style={ { fontSize: 25, fontWeight: '800' } }>{ origin.id }</Text>
                            <Text numberOfLines={ 1 }>{ origin.label }</Text>
                        </View>
                    </TouchableHighlight>
                    <View style={ { alignItems: 'center', justifyContent: 'center' } }>
                        <Text>-</Text>
                    </View>
                    <TouchableHighlight
                        style={ { flex: 0.45, borderWidth: 1, justifyContent: 'center', alignItems: 'center' } }
                        onPress={ () => this.onLocationSearch(ACTION_UPDATE_DESTINATION) }
                        underlayColor={ 'transparent' }>
                        <View style={ { justifyContent: 'center', alignItems: 'center' } }>
                            <Text style={ { color: 'gray' } }>Nereye</Text>
                            <Text style={ { fontSize: 25, fontWeight: '800' } }>{ destination.id }</Text>
                            <Text numberOfLines={ 1 }>{ destination.label }</Text>
                        </View>
                    </TouchableHighlight>
                </View>
                <View style={ { flexDirection: 'row', justifyContent: 'space-around' } }>
                    <TouchableHighlight
                        onPress={ () => this.onToggleRoundtrip(0) }
                        underlayColor={ 'transparent' }
                        style={ {
                            padding: 5,
                            borderRadius: 50,
                            borderColor: 'rgba(0,0,0,0.2)',
                            borderWidth: 1,
                            backgroundColor: 'white',
                            flex: 0.43,
                            alignItems: 'center'
                        } }>
                        <Text>{ !returnDate && '>' } Tek Yön</Text>
                    </TouchableHighlight>
                    <TouchableHighlight
                        onPress={ () => this.onToggleRoundtrip(1) }
                        underlayColor={ 'transparent' }
                        style={ {
                            padding: 5,
                            borderRadius: 50,
                            borderColor: 'rgba(0,0,0,0.2)',
                            borderWidth: 1,
                            backgroundColor: 'white',
                            flex: 0.43,
                            alignItems: 'center'
                        } }>
                        <Text>{ returnDate && '>' } Gidiş - Dönüş</Text>
                    </TouchableHighlight>
                </View>
                <View style={ {
                    margin: 10,
                    borderWidth: 1,
                } }>
                    <View style={ {
                        padding: 10,
                        backgroundColor: 'white',
                        flexDirection: 'row',
                        justifyContent: 'space-around',
                        alignItems: 'stretch'
                    } }>
                        <TouchableHighlight
                            style={ { flex: 0.45, borderWidth: 1, justifyContent: 'center', alignItems: 'center' } }
                            onPress={ () => this.onCalendarList(ACTION_UPDATE_DEPARTURE_DATE) }
                            underlayColor={ 'transparent' }>
                            <View style={ { justifyContent: 'center', alignItems: 'center' } }>
                                <Text>Gidiş Tarihi</Text>
                                <Text style={ { fontSize: 25, fontWeight: '800' } }>{ departureMoment.date() }</Text>
                                <Text>{ departureMoment.format('MMMM') }, { departureMoment.format('dddd') }</Text>
                            </View>
                        </TouchableHighlight>
                        <View style={ { alignItems: 'center', justifyContent: 'center' } }>
                            <Text>-</Text>
                        </View>
                        <TouchableHighlight
                            style={ {
                                flex: 0.45,
                                borderWidth: 1,
                                alignContent: 'center',
                                justifyContent: 'center',
                                alignItems: 'center'
                            } }
                            onPress={ () => this.onCalendarList(ACTION_UPDATE_RETURN_DATE) }
                            underlayColor={ 'transparent' }>
                            { returnContainer }
                        </TouchableHighlight>
                    </View>

                    <TouchableHighlight
                        onPress={ () => this.onTogglePassengerModal(true) }
                        underlayColor={ 'transparent' }>
                        <View style={ {
                            paddingLeft: 20,
                            paddingRight: 20,
                            paddingBottom: 10,
                            backgroundColor: 'white',
                            flexDirection: 'row',
                            justifyContent: 'space-between'
                        } }>
                            <Text>
                                { this.countTotalPassengers() } Yolcu / { CABIN_MAP[CABIN_MAP_ID[cabinClass]]['label'] }
                            </Text>
                            <Text>Yolcu ekle</Text>
                        </View>
                    </TouchableHighlight>
                    <PassengerModal
                        visible={ this.state.passengerModalVisible }
                        onClose={ () => this.onTogglePassengerModal(false) }/>
                </View>
                <View style={ {
                    margin: 5,
                    marginLeft: 10,
                    marginRight: 10,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                } }>
                    <Text>Sadece aktramasiz ucuslari goster</Text>
                    <Switch value={ nonStop } onValueChange={ () => this.setState({ nonStop: !nonStop }) }/>
                </View>
                <View style={ { margin: 10, marginTop: 0 } }>
                    <TouchableHighlight
                        onPress={ () => this.search() }
                        underlayColor={ 'transparent' }>
                        <Text style={ { margin: 10, padding: 10, textAlign: 'center', borderWidth: 1 } }>Search</Text>
                    </TouchableHighlight>
                </View>
            </ScrollView>
        )
    }
}

const mapStateToProps = (state, props) => ({
    origin: state.origin,
    destination: state.destination,
    departureDate: state.departureDate,
    returnDate: state.returnDate,
    passengers: state.passengers,
    cabinClass: state.cabinClass
})

const mapDispatchToProps = dispatch => ({})

export default connect(mapStateToProps, mapDispatchToProps)(SearchScreen)