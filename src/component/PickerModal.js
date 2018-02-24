import React, { Component } from 'react'
import {
    Text,
    View,
    Picker,
    Modal,
    TouchableHighlight
} from 'react-native'

const Item = Picker.Item

export default class PickerModal extends Component {
    constructor(props) {
        super(props)

        this.state = {
            visible: false,
            value: props.selected
        }
    }

    toggleModal(visible) {
        if (visible === false) {
            const { onPick } = this.props

            onPick(this.state.value)
        }

        this.setState({ visible })
    }

    onValueChange(value) {
        this.setState({
            value
        })
    }

    renderItems() {
        return this.props.items.map((item, i) => (
            <Item
                key={ i }
                value={ item.id }
                label={ item.label }
            />
        ))
    }

    render() {
        return (
            <View style={ { backgroundColor: 'gray' } }>
                <Modal
                    animationType={ 'slide' }
                    transparent={ true }
                    onRequestClose={ () => this.toggleModal(false) }
                    visible={ this.state.visible }>
                    <View style={ {
                        flex: 1,
                        backgroundColor: 'white',
                        top: '70%',
                        borderTopWidth: 1,
                    } }>
                        <TouchableHighlight
                            style={ { alignSelf: 'flex-end', padding: 10 } }
                            underlayColor={ 'transparent' }
                            onPress={ () => this.toggleModal(false) }>
                            <Text style={ { color: 'black', fontSize: 18 } }>Select</Text>
                        </TouchableHighlight>
                        <Picker
                            pickerStyle={ { color: 'black' } }
                            selectedValue={ this.state.value }
                            onValueChange={ value => this.onValueChange(value) }>
                            { this.renderItems() }
                        </Picker>
                    </View>
                </Modal>
            </View>
        )
    }
}