import React, { Component } from 'react'
import {
    View,
    Text,
    FlatList,
    TouchableHighlight,
    Alert,
    Modal
} from 'react-native'
import FlightRow from './component/flightRow'
import * as action from './action'
import * as allocateAction from '../AllocateScreen/action'
import style from './style'
import { ALLOCATE_SCREEN, RESULT_SCREEN } from '../../screen'
import SelectedFlightRow from './component/selectedFlightRow'
import ActivityIndicator from '../../component/ActivityIndicator'

export default class ResultScreen extends Component {
    constructor(props) {
        super(props)

        this.state = {
            fetching: !(props.departures || props.returns),
            allocating: false,
            requestId: props.requestId,
            departures: props.departures,
            returns: props.returns,
            airlines: props.airlines,
            airports: props.airports,
            matrix: null,
            matrixReturns: props.matrixReturns
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

        let matrix = null
        if (result.matrix) {
            matrix = this.prepareMatrix(result.matrix)
        }

        this.setState({
            fetching: false,
            requestId: result.request_id,
            departures: result.flights.departure,
            returns: result.flights.return,
            airlines: result.airlines,
            airports: result.airports,
            matrix
        })
    }

    prepareMatrix(matrix) {
        let sortedMatrix = []

        for (const [depKey, returnValues] of Object.entries(matrix)) {
            let sortedPrices = []

            for (let [retKey, price] of Object.entries(returnValues)) {
                price.retKey = retKey
                sortedPrices.push(price)
            }

            sortedPrices.sort((a, b) => (a.price - b.price))
            sortedMatrix.push({ 'depKey': depKey, 'returns': sortedPrices })
        }

        sortedMatrix.sort((a, b) => (a.returns[0].price - b.returns[0].price))

        return sortedMatrix
    }

    onSelect(flight) {
        const { navigator, returnDate, departureSelected = null } = this.props

        // dismiss modal to avoid bug -> https://github.com/wix/react-native-navigation/issues/167
        setTimeout(() => {
            navigator.dismissAllModals()
        }, 500)

        const {
            requestId,
            returns,
            airlines,
            airports,
            matrix
        } = this.state

        if (returnDate && !departureSelected) {
            const {
                origin,
                destination,
                departureDate,
                passengers,
                cabinClass,
                nonStop
            } = this.props

            let matrixReturns = null

            if (matrix) {
                matrixReturns = this.getMatrixReturns(flight.enuid)
            }

            navigator.push({
                screen: RESULT_SCREEN,
                title: 'Dönüş Uçuşunu Seçin',
                backButtonTitle: '',
                passProps: {
                    requestId,
                    matrixReturns,
                    returns,
                    airlines,
                    airports,
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
            this.onAllocateRequest(requestId, departureSelected, flight)
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

        this.setState({ allocating: false })
    }

    getMatrixReturns(id) {
        const { matrix } = this.state

        for (const key in matrix) {
            if (id === matrix[key].depKey) {
                return matrix[key].returns
            }
        }

        throw new Error(`Matrix key for enuid ${id} not found`)
    }

    prepareMatrixReturns() {
        let { returns } = this.state

        // quick&dirty deep copy
        returns = JSON.parse(JSON.stringify(returns))

        for (let key in returns) {
            const price = this.getMatrixReturnPrice(returns[key].enuid)

            if (price) {
                returns[key].detail_price = price.detail_price
                returns[key].average_price = price.average_price
            } else {
                returns.splice(key, 1)
            }
        }

        return returns.sort((a, b) => (a.price - b.price))
    }

    getMatrixReturnPrice(id) {
        const { matrixReturns } = this.state

        for (const price of matrixReturns) {
            if (price.retKey === id) {
                return price
            }
        }

        return null
    }

    render() {
        const { origin, destination, departureSelected = null } = this.props
        let {
            fetching,
            allocating,
            departures,
            returns,
            airlines,
            airports,
            matrixReturns
        } = this.state

        if (fetching) {
            return (
                <Modal
                    animationType={ 'none' }
                    transparent={ false }
                    visible={ fetching }>
                    <ActivityIndicator/>
                    <View style={ { flex: 1, justifyContent: 'center', alignItems: 'center' } }>
                        <Text style={ { top: 50 } }>Uçuşlar hazırlanıyor</Text>
                    </View>
                </Modal>
            )
        }

        if (!airports) {
            this.props.navigator.pop()
            Alert.alert('No Flights')
            return null
        }

        if (matrixReturns) {
            returns = this.prepareMatrixReturns()

            console.log('prepared matrix returns', returns)
        }

        return (
            <View style={ { flex: 1 } }>
                { departureSelected && (
                    <SelectedFlightRow
                        airlines={ airlines }
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
                    data={ departureSelected ? returns : departures }
                    renderItem={ ({ item }) => (
                        <FlightRow
                            airlines={ airlines }
                            airports={ airports }
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