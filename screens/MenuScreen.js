import React, { Component } from 'react';
import { StyleSheet, View, TouchableHighlight, Text, AsyncStorage, ActivityIndicator} from 'react-native';
import { openDatabase, deleteDatabase} from 'react-native-sqlite-storage';
import {FLOWS} from "../apis/values";
// deleteDatabase({name: 'HRTODatabase.db'});
let db = openDatabase({ name: 'HRTODatabase.db' });
export default class MenuScreen extends Component {
    static navigationOptions = {
        title: 'Menu',
        headerStyle: {
            backgroundColor: '#500000',
        },
        headerTintColor: '#fff'
    };

    constructor(props) {
        super(props);
        console.log("Creating Tables");
        // db.transaction((txn) => {
        //     txn.executeSql('DROP TABLE IF EXISTS table_events', [], (txn, resultSet) => {
        //         txn.executeSql('DROP TABLE IF EXISTS table_missions', [], (txn, resultSet) => {
        //             txn.executeSql('DROP TABLE IF EXISTS table_sorties', [], (txn, resultSet) => {
        //                 txn.executeSql('DROP TABLE IF EXISTS table_roles', [], (txn, resultSet) => {
        //                     txn.executeSql('DROP TABLE IF EXISTS table_observations', [], (txn, resultSet) => {
        //                         console.log("Deleted Tables" + resultSet);
        //                     });
        //                 });
        //             });
        //         });
        //     });
        // })
        db.transaction((txn) => {
            txn.executeSql('CREATE TABLE IF NOT EXISTS table_events(event_id INTEGER PRIMARY KEY AUTOINCREMENT, event_name VARCHAR(50) UNIQUE, event_description VARCHAR(250))', [], (txn, resultSet) => {
                txn.executeSql('CREATE TABLE IF NOT EXISTS table_missions(mission_id INTEGER PRIMARY KEY AUTOINCREMENT, event_id INTEGER, mission_name VARCHAR(50), mission_description VARCHAR(250), mission_observations VARCHAR(250), mission_type INTEGER, FOREIGN KEY(event_id) REFERENCES table_events)',[], (txn, resultSet) => {
                    txn.executeSql('CREATE TABLE IF NOT EXISTS table_sorties(sortie_id INTEGER PRIMARY KEY AUTOINCREMENT, mission_id INTEGER, sortie_name VARCHAR(50), sortie_observation VARCHAR(250), sortie_location VARCHAR(250), FOREIGN KEY(mission_id) REFERENCES table_missions)',[], (txn, resultSet) => {
                        txn.executeSql('CREATE TABLE IF NOT EXISTS table_roles(role_id INTEGER PRIMARY KEY AUTOINCREMENT, sortie_id INTEGER, role_name VARCHAR(50) ,role_type INTEGER, FOREIGN KEY(sortie_id) REFERENCES table_sorties)',[], (txn, resultSet) => {
                            txn.executeSql('CREATE TABLE IF NOT EXISTS table_observations(observation_id INTEGER PRIMARY KEY AUTOINCREMENT, role_id INTEGER, sortie_id INTEGER, timestamp TIMESTAMP, step INTEGER, event INTEGER, FOREIGN KEY(role_id) REFERENCES table_roles, FOREIGN KEY(sortie_id) REFERENCES table_sorties)',[], (txn, resultSet) => {
                                this.setState({
                                    ready: true
                                });
                            });
                        });
                    });
                });
            });
        })
    }

    render() {
        const {navigate} = this.props.navigation;
        if(this.state && this.state.ready)
            return (
                <View style={{flex: 1, flexDirection: 'column', justifyContent: 'center', padding: 10}}>
                    <View style={{padding: 5}}>
                        <TouchableHighlight
                            style={styles.button}
                            onPress={() => navigate('EventSetup', {flow: FLOWS.NEW})}
                        >
                            <Text style={styles.buttonText}> Start Event </Text>
                        </TouchableHighlight>
                    </View>
                    <View style={{padding: 5}}>
                        <TouchableHighlight
                            style={styles.button}
                            onPress={() => navigate('LibraryEvents', {flow: FLOWS.RESUME})}
                        >
                            <Text style={styles.buttonText}> Resume Event </Text>
                        </TouchableHighlight>
                    </View>
                    <View style={{padding: 5}}>
                        <TouchableHighlight
                            style={styles.button}
                            onPress={() => navigate('LibraryEvents', {flow: FLOWS.LIBRARY})}
                        >
                            <Text style={styles.buttonText}> Library </Text>
                        </TouchableHighlight>
                    </View>
                </View>
            );
        else
            return (
                <View style={styles.container}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            )
    }
}

let styles=StyleSheet.create({
    button: {
        alignItems: 'center',
        backgroundColor: '#500000',
        padding: 10,
        borderRadius: 5
    },
    buttonText: {
        color: '#fff',
        fontWeight: '500'
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});