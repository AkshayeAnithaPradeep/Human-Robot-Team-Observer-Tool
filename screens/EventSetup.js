import React, { Component } from 'react';
import Text from "react-native-svg/elements/Text";
import {ScrollView, StyleSheet, View, KeyboardAvoidingView, ActivityIndicator, Alert} from 'react-native';
import StickyFooter from './subviews/StickyFooter';
import { openDatabase } from 'react-native-sqlite-storage';
import {FLOWS} from "../apis/values";
let db = openDatabase({ name: 'HRTODatabase.db' });
let t = require('tcomb-form-native');

let Form = t.form.Form;

let Event = t.struct({
    eventName: t.String,
    eventDescription: t.maybe(t.String)
});

const options = {
    fields: {
        eventName: {
            error: "Event Name cannot be empty",
            autoFocus: true,
            selectTextOnFocus: true
        },
        eventDescription: {
            multiline: true,
            numberOfLines: 3
        }
    }
};


export default class EventSetup extends Component {
    static navigationOptions = {
        title: 'Event Setup',
        headerStyle: {
            backgroundColor: '#500000',
        },
        headerTintColor: '#fff'
    };
    navParams = this.props.navigation.state.params;

    constructor(props) {
        super(props);
    }

    _onCancelPressButton() {
        this.props.navigation.navigate("Home");
    }
    _onProceedPressButton() {
        let value = this.refs.form.getValue();
        if (value) { // if validation fails, value will be null
            db.transaction((txn) => {
                txn.executeSql('INSERT INTO table_events (event_name, event_description )VALUES(? ,?)',
                    [value.eventName, value.eventDescription],
                    (tx, resultSet) => {
                        console.log('Results', resultSet.insertId);
                        this.props.navigation.navigate("MissionSetup", {eventID: resultSet.insertId, flow: FLOWS.NEW});
                    }, (error) => {
                        Alert.alert(
                            'Error',
                            'Event Name Already Exists',
                            [
                                {text: 'OK', onPress: () => console.log('OK Pressed')},
                            ],
                            {cancelable: false},
                        );
                        console.log(error);
                    })
            });
        }
    }

    render() {
        const {navigate} = this.props.navigation;
        return (
            <KeyboardAvoidingView style = {{flex: 1}} behavior="padding" enabled>
                <View style = {styles.formContainer}>
                    <Form
                        ref="form"
                        type={Event}
                        options={options}
                    />
                </View>
                <StickyFooter cancelFunc = {this._onCancelPressButton.bind(this)} proceedFunc = {this._onProceedPressButton.bind(this)}/>
            </KeyboardAvoidingView>
        );
    }
}

let styles = StyleSheet.create({
    formContainer: {
        flex: .8, paddingLeft: 20,
        paddingRight: 20,
        justifyContent: 'center',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});