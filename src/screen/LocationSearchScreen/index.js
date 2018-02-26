import React, { Component } from 'react'
import {
    View,
    ScrollView,
    KeyboardAvoidingView,
    Text,
    TextInput,
    TouchableHighlight
} from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as action from './action'

let setTimeoutId = null

class LocationSearchScreen extends Component {
    constructor(props) {
        super(props)

        this.state = {
            defaults: [
                {
                    id: 'ISTA',
                    label: 'Istanbul, Turkiye (Tumu)'
                },
                {
                    id: 'AYT',
                    label: 'Antalya, Turkiye'
                }
            ],
            result: []
        }
    }

    dismissScreen() {
        this.props.navigator.dismissModal()
    }

    search(term) {
        if (term.length > 2) {
            clearTimeout(setTimeoutId)
            setTimeoutId = setTimeout(async () => {
                const result = await action.fetchResult(term)

                this.setState({
                    result
                })
            }, 500)
        }
    }

    onLocationSelect(type, location) {
        this.props.action.setLocation(type, location)

        this.dismissScreen()
    }

    render() {
        const { type } = this.props
        const { defaults, result } = this.state

        let list = result.length > 0 ? result : defaults

        return (
            <KeyboardAvoidingView style={ { flex: 1, marginBottom: 10, backgroundColor: 'white' } }>
                <View style={ { padding: 5, backgroundColor: 'rgba(0,0,0,0.02)' } }>
                    <TextInput
                        style={ { padding: 5, borderWidth: 1, borderColor: 'rgba(0,0,0,0.1)', borderRadius: 5 } }
                        placeholder={ 'Şehir veya Havalimanı' }
                        onChangeText={ term => this.search(term) }/>
                    <Text style={ {
                        paddingLeft: 5,
                        paddingTop: 10,
                        paddingBottom: 10
                    } }>{ result.length > 0 ? 'Sonuç' : 'Popüler Seçenekler' }</Text>
                </View>
                <ScrollView>
                    { list.map((location, index) => (
                        <View key={ index } style={ {
                            borderBottomWidth: 1,
                            borderBottomColor: 'rgba(0,0,0,0.1)',
                            padding: 10,
                        } }>
                            <TouchableHighlight
                                onPress={ () => this.onLocationSelect(type, location) }
                                underlayColor={ 'transparent' }>
                                <Text>{ location.id } | { location.label }</Text>
                            </TouchableHighlight>
                        </View>
                    )) }
                </ScrollView>
            </KeyboardAvoidingView>
        )
    }
}

const mapStateToProps = (state, props) => ({})

const mapDispatchToProps = dispatch => ({
    action: bindActionCreators(action, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(LocationSearchScreen)