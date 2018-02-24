import React, { Component } from 'react'
import {
    ActivityIndicator as BaseActivityIndicator,
    StyleSheet,
    Dimensions
} from 'react-native'

export default class ActivityIndicator extends Component {
    render() {
        return (
            <BaseActivityIndicator
                size="large"
                style={ styles.animating }
                animating={ true }/>
        )
    }
}

const styles = StyleSheet.create({
    animating: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 999
    }
})