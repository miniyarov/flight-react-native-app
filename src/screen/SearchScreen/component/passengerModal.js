import React, { Component } from 'react'
import {
    View,
    Text,
    Modal,
    Alert,
    TouchableHighlight
} from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { PassengerRow } from './passengerRow'
import dispatcher from '../../../store/dispatcher'
import { ACTION_UPDATE_CABIN_CLASS, ACTION_UPDATE_PASSENGERS } from '../reducer'
import PickerModal from '../../../component/PickerModal'

const passengerMap = [
    { type: 'adult', label: 'Yetişkin', sub: null },
    { type: 'child', label: 'Çocuk', sub: '(2-12 Yaş)' },
    { type: 'infant', label: 'Bebek', sub: '(0-2 Yaş)' },
    { type: 'senior', label: '65 yaş üstü', sub: null },
    { type: 'student', label: 'Öğrenci', sub: '(12-24 Yaş)' },
]

export const CABIN_MAP = [
    {
        id: 'ekonomi',
        label: 'Ekonomi'
    },
    {
        id: 'business',
        label: 'Business'
    }
]

export const CABIN_MAP_ID = { 'ekonomi': 0, 'business': 1 }

class PassengerModal extends Component {
    constructor(props) {
        super(props)

        this.state = {
            passengers: props.passengers
        }
    }

    onDecrement(type) {
        let passengers = this.state.passengers
        let count = passengers[type] - 1
        let totalAdult = passengers['adult'] + passengers['senior'] + passengers['student']

        if (type !== 'infant' && totalAdult < passengers['infant']) {
            Alert.alert('Infant count exceeds Adult count')
        } else if (count >= 0) {
            passengers[type] = count
            this.setState({
                passengers
            })
        }
    }

    onIncrement(type) {
        let passengers = this.state.passengers
        let count = passengers[type] + 1
        let totalExceptInfant = passengers['adult'] + passengers['child'] + passengers['senior'] + passengers['student']
        let totalAdult = passengers['adult'] + passengers['senior'] + passengers['student']

        if (type === 'infant' && (count > totalAdult)) {
            Alert.alert('Infant count should not exceed adults count')
        } else if (count > 7 || (type !== 'infant' && (totalExceptInfant + 1) > 7)) {
            Alert.alert('Max Passenger Count 7 exceeds')
        } else {
            passengers[type] = count
            this.setState({
                passengers
            })
        }
    }

    onOk() {
        const { onClose } = this.props
        const { passengers } = this.state
        let totalAdult = passengers['adult'] + passengers['senior'] + passengers['student']

        if (totalAdult > 0) {
            this.props.dispatcher(ACTION_UPDATE_PASSENGERS, passengers)
            onClose()
        } else {
            Alert.alert('Select at least one adult passenger')
        }
    }

    onClassPick(cabinClass) {
        this.props.dispatcher(ACTION_UPDATE_CABIN_CLASS, cabinClass)
    }

    // componentWillReceiveProps(nextProps) {
    //     // update passenger counts if nextProp has updated ones
    //     const totalInProps = nextProps.passengers['adult'] + nextProps.passengers['child'] + nextProps.passengers['senior'] + nextProps.passengers['student'] + nextProps.passengers['infant']
    //     const totalInState = this.state.passengers['adult'] + this.state.passengers['child'] + this.state.passengers['senior'] + this.state.passengers['student'] + this.state.passengers['infant']
    //
    //     if (totalInProps !== totalInState) {
    //         this.setState({
    //             passengers
    //         })
    //     }
    // }

    render() {
        const { passengers } = this.state
        const { cabinClass, visible, onClose } = this.props
        const cabinClassLabel = CABIN_MAP[CABIN_MAP_ID[cabinClass]]['label']

        return (
            <Modal
                animationType={ 'slide' }
                transparent={ true }
                visible={ visible }
                onRequestClose={ () => onClose() }>
                <View style={ { flex: 1, backgroundColor: 'rgba(0,0,0,0.1)', paddingTop: '90%' } }>
                    <View style={ {
                        flex: 1,
                        borderTopWidth: 1,
                        backgroundColor: 'white',
                        padding: 10,
                        paddingLeft: 20,
                        paddingRight: 20
                    } }>
                        <View style={ { flexDirection: 'row', justifyContent: 'space-between' } }>
                            <Text style={ { fontSize: 20 } }>Yolcu Sayısı</Text>
                            <TouchableHighlight
                                onPress={ () => onClose() }
                                underlayColor={ 'transparent' }>
                                <Text style={ { fontSize: 20, right: 10 } }>X</Text>
                            </TouchableHighlight>
                        </View>
                        <View style={ {
                            marginTop: 20
                        } }>
                            {
                                passengerMap.map((passenger, index) => (
                                    <PassengerRow
                                        key={ index }
                                        onDecrement={ type => this.onDecrement(type) }
                                        onIncrement={ type => this.onIncrement(type) }
                                        type={ passenger.type }
                                        label={ passenger.label }
                                        sub={ passenger.sub }
                                        count={ passengers[passenger.type] }/>
                                ))
                            }
                        </View>
                        <PickerModal
                            ref={ ref => this._classPicker = ref }
                            selected={ cabinClass }
                            onPick={ cabinClass => this.onClassPick(cabinClass) }
                            items={ CABIN_MAP }
                        />
                        <TouchableHighlight
                            onPress={ () => this._classPicker.toggleModal(true) }
                            underlayColor={ 'transparent' }>
                            <View style={ {
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                padding: 5,
                                paddingTop: 10,
                                paddingBottom: 10,
                                borderWidth: 1
                            } }>
                                <Text>Sinif degistir</Text>
                                <Text>{ cabinClassLabel }</Text>
                            </View>
                        </TouchableHighlight>
                        <TouchableHighlight
                            style={ { alignSelf: 'flex-end', padding: 10, borderWidth: 1, marginTop: 5 } }
                            onPress={ () => this.onOk() }
                            underlayColor={ 'transparent' }>
                            <Text>Tamam</Text>
                        </TouchableHighlight>
                    </View>
                </View>
            </Modal>
        )
    }
}

const mapStateToProps = (state, props) => ({
    passengers: state.passengers,
    cabinClass: state.cabinClass
})

const mapDispatchToProps = dispatch => ({
    dispatcher: bindActionCreators(dispatcher, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(PassengerModal)