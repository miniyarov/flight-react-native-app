import React, { Component } from 'react'
import { View, WebView } from 'react-native'
import ActivityIndicator from '../../component/ActivityIndicator'

export default class PaymentScreen extends Component {
    constructor(props) {
        super(props)

        this.state = {
            loading: true
        }
    }

    onLoadEnd() {
        setTimeout(() => {
            this.setState({
                loading: false
            })
        }, 500)
    }

    render() {
        const { redirectUrl } = this.props
        const { loading } = this.state

        return (
            <View style={ { flex: 1 } }>
                { loading && <ActivityIndicator animating={ true }/> }
                <WebView
                    onLoadEnd={ () => this.onLoadEnd() }
                    source={ { uri: redirectUrl } }
                />
            </View>
        )
    }
}