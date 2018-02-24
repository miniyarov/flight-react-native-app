import React, { Component } from 'react'
import {
    View,
    Text,
    FlatList,
    TouchableHighlight,
    Alert
} from 'react-native'
import FlightRow from './component/flightRow'
import * as action from './action'
import * as allocateAction from '../AllocateScreen/action'
import style from './style'
import { ALLOCATE_SCREEN, RESULT_SCREEN } from '../../screen'
import SelectedFlightRow from './component/selectedFlightRow'

export default class ResultScreen extends Component {
    constructor(props) {
        super(props)

        this.state = {
            fetching: !props.result,
            allocating: false,
            result: props.result
        }
    }

    componentDidMount() {
        const { departureSelected = null } = this.props

        if (!departureSelected) {
            this.fetchResult()
        }
    }

    async fetchResult() {
        const {
            origin,
            destination,
            departureDate,
            returnDate,
            passengers,
            cabinClass,
            nonStop
        } = this.props

        this.setState({
            fetching: true
        })

        const result = await action.fetchResult(
            origin,
            destination,
            departureDate,
            returnDate,
            passengers,
            cabinClass,
            nonStop
        )

        this.setState({
            fetching: false,
            result
        })
    }

    onSelect(flight) {
        const { navigator, returnDate, departureSelected = null } = this.props
        const { result } = this.state

        if (returnDate && !departureSelected) {
            const {
                origin,
                destination,
                departureDate,
                passengers,
                cabinClass,
                nonStop
            } = this.props

            navigator.push({
                screen: RESULT_SCREEN,
                title: 'Dönüş Uçuşunu Seçin',
                backButtonTitle: '',
                passProps: {
                    result,
                    departureSelected: flight,
                    origin,
                    destination,
                    departureDate,
                    returnDate,
                    passengers,
                    cabinClass,
                    nonStop
                }
            })
        } else {
            this.onAllocateRequest(result.request_id, departureSelected, flight)
        }
    }

    async onAllocateRequest(requestId, departureSelected, flight) {
        this.setState({ allocating: true })

        const detail = await allocateAction.allocateResult(requestId, departureSelected, flight)

        this.props.navigator.push({
            screen: ALLOCATE_SCREEN,
            title: 'Uçuş Bilgileri',
            backButtonTitle: '',
            passProps: {
                detail
            }
        })
    }

    render() {
        const { origin, destination, departureSelected = null } = this.props
        const { fetching, result } = this.state

        if (fetching) {
            return (
                <View style={ { flex: 1 } }>
                    <Text>Loading...</Text>
                </View>
            )
        }

        if (!result.flights) {
            this.props.navigator.pop()
            Alert.alert('No Flights')
            return (<Text>{ '' }</Text>)
        }

        return (
            <View style={ { flex: 1 } }>
                { departureSelected && (
                    <SelectedFlightRow
                        airlines={ result.airlines }
                        flight={ departureSelected }/>
                ) }
                <View style={ {
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    padding: 10,
                    backgroundColor: 'green'
                } }>
                    <TouchableHighlight><Text style={ { color: 'white' } }>{ '<<' }</Text></TouchableHighlight>
                    { departureSelected ? (
                        <Text style={ { color: 'white' } }>{ destination.id } &rarr; { origin.id }</Text>
                    ) : (
                        <Text style={ { color: 'white' } }>{ origin.id } &rarr; { destination.id }</Text>
                    ) }
                    <TouchableHighlight><Text style={ { color: 'white' } }>{ '>>' }</Text></TouchableHighlight>
                </View>
                <FlatList
                    key={ 'list' }
                    style={ style.flatList }
                    data={ departureSelected ? result.flights.return : result.flights.departure }
                    renderItem={ ({ item }) => (
                        <FlightRow
                            airlines={ result.airlines }
                            airports={ result.airports }
                            flight={ item }
                            onSelect={ (flight) => this.onSelect(flight) }
                        />
                    ) }
                    keyExtractor={ item => item.enuid }
                    initialNumToRender={ 10 }
                />
            </View>
        )
    }
}