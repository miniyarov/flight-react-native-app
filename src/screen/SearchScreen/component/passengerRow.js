import React from 'react'
import {
    View,
    Text,
    TouchableHighlight
} from 'react-native'

export const PassengerRow = ({ type, label, sub, count, onDecrement, onIncrement }) => (
    <View style={ {
        paddingTop: 10,
        paddingBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    } }>
        <Text style={ { fontSize: 18 } }>
            { label } { sub && (<Text style={ { fontSize: 14, color: 'gray' } }>{ sub }</Text>) }
        </Text>
        <View style={ {
            flexDirection: 'row',
            alignItems: 'center'
        } }>
            <TouchableHighlight
                underlayColor={ 'transparent' }
                onPress={ () => onDecrement(type) }>
                <Text style={ style }>-</Text>
            </TouchableHighlight>
            <Text style={ { margin: 10 } }>{ count }</Text>
            <TouchableHighlight
                underlayColor={ 'transparent' }
                onPress={ () => onIncrement(type) }>
                <Text style={ style }>+</Text>
            </TouchableHighlight>
        </View>
    </View>
)

const style = {
    fontSize: 18,
    borderWidth: 1,
    borderRadius: 19,
    padding: 15,
    paddingTop: 7.5,
    paddingBottom: 7.5
}