import React, { Component } from 'react'
import {
    KeyboardAvoidingView,
    Text,
    ScrollView,
    View,
    TextInput,
    TouchableHighlight,
    Alert
} from 'react-native'
import PickerModal from '../../component/PickerModal'
import * as action from './action'
import { PAYMENT_SCREEN } from '../../screen'

let genderPickerRef = []

export default class BookScreen extends Component {
    constructor(props) {
        super(props)

        this.state = {
            passengers: this.preparePassengerObject(),
            contact: {
                email: '',
                cellphone_country: '90',
                cellphone: ''
            }
        }
    }

    preparePassengerObject() {
        const { passengers } = this.props

        let passengerObject = []
        Object.keys(passengers).forEach(key => {
            let passenger = passengers[key]

            for (let i = 0; i < passenger.count; i++) {
                passengerObject.push({
                    passengerType: passenger.type,
                    birthdate: '',
                    publicId: '',
                    firstname: '',
                    lastname: '',
                    gender: null
                })
            }
        })

        return passengerObject
    }

    async onSubmit() {
        const { navigator, requestId } = this.props
        const { passengers, contact } = this.state

        for (let passenger of passengers) {
            if (
                passenger.firstname === '' ||
                passenger.lastname === '' ||
                passenger.gender === null ||
                passenger.birthdate === ''
            ) {
                Alert.alert('Hata', 'Yolcu isimlerini tam doldurun')
                return
            }
        }

        if (contact.email === '' || contact.cellphone === '') {
            Alert.alert('Hata', 'İletişim bilgilerini doldurun')
            return
        }

        const result = await action.bookResult(requestId, passengers, contact)

        if (!result.redirect_to) {
            if (result.description) {
                if (result.type === 'search') {
                    navigator.popToRoot()
                }
                Alert.alert(result.description)
            } else {
                Alert.alert('Hata', 'Bilinmeyen hata, tekrar deneyin.')
            }
        } else {
            navigator.push({
                screen: PAYMENT_SCREEN,
                backButtonTitle: '',
                passProps: {
                    redirectUrl: result.redirect_to
                }
            })
        }
    }

    updatePassenger(count, type, value) {
        let { passengers } = this.state
        passengers[count][type] = value

        this.setState({
            passengers
        })
    }

    updateContact(type, value) {
        let { contact } = this.state
        contact[type] = value

        this.setState({
            contact
        })
    }

    passengerForm(passenger, count) {
        const statePassenger = this.state.passengers[count]

        return (
            <View key={ count }>
                <View style={ {
                    padding: 15,
                    backgroundColor: 'rgba(0,0,0,0.2)'
                } }>
                    <Text style={ { fontSize: 14, fontWeight: 'bold' } }>{ (count + 1) }. Yolcu
                        ({ passenger.type_description })</Text>
                </View>
                <View style={ { padding: 15, paddingRight: 0 } }>
                    <TextInput
                        onChangeText={ text => this.updatePassenger(count, 'firstname', text) }
                        style={ styles.input }
                        placeholder={ 'Ad' }/>
                    <TextInput
                        onChangeText={ text => this.updatePassenger(count, 'lastname', text) }
                        style={ styles.input }
                        placeholder={ 'Soyad' }/>
                    <TextInput
                        onChangeText={ text => this.updatePassenger(count, 'publicId', text) }
                        style={ styles.input }
                        placeholder={ 'TC Kimlik No' }/>
                    {
                        count === 0 &&
                        [
                            <TextInput
                                key={ 0 }
                                onChangeText={ text => this.updateContact('cellphone', text) }
                                style={ styles.input }
                                placeholder={ 'Cep telefonu' }/>,
                            <TextInput
                                key={ 1 }
                                onChangeText={ text => this.updateContact('email', text) }
                                style={ styles.input }
                                placeholder={ 'E-posta' }/>
                        ]
                    }
                    <TextInput
                        onChangeText={ text => this.updatePassenger(count, 'birthdate', text) }
                        style={ styles.input }
                        placeholder={ 'Dogum Tarihi (dd-mm-YYYY)' }/>
                    <PickerModal
                        ref={ ref => genderPickerRef[count] = ref }
                        selected={ 'M' }
                        onPick={ gender => this.updatePassenger(count, 'gender', gender) }
                        items={ [{ id: 'M', label: 'Bay' }, { id: 'F', label: 'Bayan' }] }
                    />
                    <TouchableHighlight
                        underlayColor={ 'transparent' }
                        style={ styles.input }
                        onPress={ () => genderPickerRef[count].toggleModal(true) }>
                        <Text
                            style={ [statePassenger.gender ? {} : { color: 'silver' }] }>
                            { statePassenger.gender ? (statePassenger.gender === 'M' ? 'Bay' : 'Bayan') : 'Cinsiyet' }
                        </Text>
                    </TouchableHighlight>
                </View>
            </View>
        )
    }

    renderPassengerForm() {
        const { passengers } = this.props

        let views = []
        let count = 0

        Object.keys(passengers).forEach(key => {
            let passenger = passengers[key]
            for (let i = 0; i < passenger.count; i++) {
                views.push(this.passengerForm(passenger, count))

                count++
            }
        })

        return views
    }

    render() {
        return (
            <KeyboardAvoidingView style={ { flex: 1, marginBottom: 20 } }>
                <ScrollView>
                    { this.renderPassengerForm() }
                </ScrollView>
                <TouchableHighlight
                    onPress={ () => this.onSubmit() }
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
                    } }>Devam et</Text>
                </TouchableHighlight>
            </KeyboardAvoidingView>
        )
    }
}

const styles = {
    input: {
        borderBottomColor: 'rgba(0,0,0,0.1)',
        borderBottomWidth: 1,
        paddingTop: 5,
        paddingBottom: 5,
        marginBottom: 10
    }
}