import React, { Component } from 'react';
import {Text, StyleSheet, View, TouchableHighlight, Dimensions} from 'react-native';

var {height, width} = Dimensions.get('window');

export default class StickyFooter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            backTitle: this.props.backVal ? this.props.backVal : "Back",
            proceedTitle: this.props.proceedVal ? this.props.proceedVal : "Proceed"
        }
    }
    render() {
        return (
            <View style={styles.stickyFooter}>
                <View style={styles.buttonContainer}>
                    <TouchableHighlight style={styles.button} onPress={this.props.cancelFunc}>
                        <Text style={styles.buttonText}>{this.state.backTitle}</Text>
                    </TouchableHighlight>
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableHighlight style={styles.button} onPress={this.props.proceedFunc}>
                        <Text style={styles.buttonText}>{this.state.proceedTitle} </Text>
                    </TouchableHighlight>
                </View>
            </View>
        );
    }
}

let styles = StyleSheet.create({
    buttonContainer: {
        flex:1,
        padding: 1,
        margin: 20
    },
    stickyFooter: {
        flex: (25 - height/100) * 0.01,
        flexDirection: 'row',
        shadowColor: '#000',
        shadowOffset: { width: 10, height: 5 },
        shadowRadius: 18
    },
    button: {
        alignItems: 'center',
        backgroundColor: '#500000',
        padding: 10,
        borderRadius: 5
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'normal'
    }
});