import React, { Component } from 'react';
import {Button, StyleSheet, View, KeyboardAvoidingView, Alert} from 'react-native';
import StickyFooter from './subviews/StickyFooter';
import { openDatabase } from 'react-native-sqlite-storage';
import {FLOWS} from "../apis/values";
let db = openDatabase({ name: 'HRTODatabase.db' });
let t = require('tcomb-form-native');

let Form = t.form.Form;

let Mission = t.struct({
    missionName: t.String,
    missionDescription: t.maybe(t.String),
    missionObservations: t.maybe(t.String),
    missionType: t.enums({
        1: 'UGV',
        2: 'UAV',
        3: 'UMV'
    })
});

const options = {
    fields: {
        missionName: {
            error: "Please enter Mission Name",
            autoFocus: true,
            selectTextOnFocus: true
        },
        missionDescription: {
            multiline: true,
            numberOfLines: 3
        },
        missionObservations: {
            multiline: true,
            numberOfLines: 5
        },
        missionType: {
            error: "Please enter Mission Type"
        }
    }
};


export default class MissionSetup extends Component {

    navParams = this.props.navigation.state.params;

    static navigationOptions = ({ navigation }) => {
        return {
            title: 'Mission Setup',
            headerStyle: {
                backgroundColor: '#500000',
            },
            headerTintColor: '#fff',
            headerLeft: (
                <Button
                    onPress={() => {
                        console.log(navigation.state.params.flow);
                        if(navigation.state.params.flow === FLOWS.RESUME) {
                            navigation.navigate("LibraryMissions", {eventID: navigation.state.params.eventID, flow: navigation.state.params.flow});
                        }
                        else {
                            console.log(navigation);
                            db.transaction((txn) => {
                                txn.executeSql("DELETE FROM table_events WHERE event_id = ?", [navigation.state.params.eventID], (txn, results) => {
                                    console.log(results.rowsAffected);
                                    navigation.navigate("EventSetup", {flow: FLOWS.BACK_PRESS});
                                });
                            })
                        }
                    }}
                    title="Back"
                    color="#fff"
                />
            ),
        };
    };


    constructor(props) {
        super(props);
    }

    _onCancelPressButton() {
        db.transaction((txn) => {
            txn.executeSql("DELETE FROM table_events WHERE event_id = ?", [this.navParams.eventID], (txn, results) => {
                this.props.navigation.navigate("EventSetup", {flow: FLOWS.BACK_PRESS});
            });
        })
    }
    _onProceedPressButton() {
        let value = this.refs.form.getValue();
        if (value) { // if validation fails, value will be null
            db.transaction((txn) => {
                txn.executeSql('INSERT INTO table_missions (event_ID, mission_name, mission_description, mission_observations, mission_type)VALUES(? ,? ,? ,? ,?)',
                    [this.navParams.eventID, value.missionName, value.missionDescription, value.missionObservations, value.missionType],
                    (tx, results) => {
                        console.log('Results', results.insertId);
                        this.props.navigation.navigate("SortieSetup", {eventID: this.navParams.eventID ,missionID: results.insertId, missionType: value.missionType, flow: FLOWS.NEW});
                    }, (error) => {
                        Alert.alert(
                            'Error',
                            'Mission Name Already Exists',
                            [
                                {text: 'OK', onPress: () => console.log('OK Pressed')},
                            ],
                            {cancelable: false},
                        );
                        console.log(error);
                    });
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
                        type={Mission}
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