import React, { Component } from 'react';
import {Button, StyleSheet, View, KeyboardAvoidingView, Alert, ScrollView, Text} from 'react-native';
import StickyFooter from './subviews/StickyFooter';
import { openDatabase } from 'react-native-sqlite-storage';
let db = openDatabase({ name: 'HRTODatabase.db' });
import {FLOWS, ROLE_MAPS} from './../apis/values';
let t = require('tcomb-form-native');

let Form = t.form.Form;


export default class SortieSetup extends Component {

    navParams = this.props.navigation.state.params;

    static navigationOptions = ({ navigation }) => {
        return {
            title: 'Sortie Setup',
            headerStyle: {
                backgroundColor: '#500000',
            },
            headerTintColor: '#fff',
            headerLeft: (
                <Button
                    onPress={() => {
                        if(navigation.state.params.flow === FLOWS.RESUME){
                            navigation.navigate("LibrarySorties", {missionID: navigation.state.params.missionID, flow: navigation.state.params.flow});
                        }
                        else {
                            db.transaction((txn) => {
                                txn.executeSql("DELETE FROM table_missions WHERE mission_id = ?", [navigation.state.params.missionID], (txn, results) => {
                                    navigation.navigate("MissionSetup", {
                                        eventID: navigation.state.params.eventID,
                                        flow: FLOWS.BACK_PRESS
                                    });
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
        console.log(this.navParams.flow);
        this.state = {
            type: t.struct({
                sortieName: t.String,
                sortieLocation: t.maybe(t.String),
                sortieObservations: t.maybe(t.String),
            }),
            options: {
                fields: {
                    sortieName: {
                        error: "Please enter Sortie Name",
                        autoFocus: true,
                        selectTextOnFocus: true
                    },
                    sortieLocation: {
                        multiline: true,
                        numberOfLines: 5
                    },
                    sortieObservations: {
                        multiline: true,
                        numberOfLines: 5
                    }
                }
            },
            roleCount: 1,
            roleVal: {
                "Role 1": {}
            },
            sortieCreated: false
        }
    }


    componentDidMount() {
        if(this.navParams && this.navParams.setupData) {
            let formVal;
            this.setState({
                formVal: this.refs.form.getValue(),
                roleVal: this.getRoleVals()
            });
        }
    }

    _onCancelPressButton() {
        if(this.navParams.flow === FLOWS.NEW) {
            db.transaction((txn) => {
                txn.executeSql("DELETE FROM table_missions WHERE mission_id = ?", [this.navParams.missionID], (txn, results) => {
                    this.props.navigation.navigate("MissionSetup", {
                        eventID: this.navParams.eventID,
                        flow: FLOWS.BACK_PRESS
                    });
                });
            })
        }

    }
    _onProceedPressButton() {
        let value = this.refs.form.getValue();
        if (value && this.validateRoles()) {// if validation fails, value will be null
            let sqlStatement = null;
            let sqlVals = [];
            if(this.navParams.flow === FLOWS.BACK_PRESS) {
                sqlStatement = 'UPDATE table_sorties SET mission_id = ?, sortie_name = ?, sortie_observation = ?, sortie_location = ? WHERE sortie_id = ?';
                sqlVals = [this.navParams.missionID, value.sortieName, value.sortieObservations, value.sortieLocation, this.navParams.sortieID];
            }
            else {
                sqlStatement = 'INSERT INTO table_sorties (mission_id, sortie_name, sortie_observation, sortie_location)VALUES(? ,? ,? ,?)';
                sqlVals = [this.navParams.missionID, value.sortieName, value.sortieObservations, value.sortieLocation];
            }
            db.transaction((txn) => {
                txn.executeSql(sqlStatement,sqlVals,
                    (tx, results) => {
                        console.log('Results', results.insertId);
                        let sortieId = results.insertId;
                        let roleVals = this.getRoleVals();
                        let roleKeys = Object.keys(roleVals);
                        console.log(roleKeys);
                        let roleIds = {};
                        let x = 0;
                        let loopInsert = function() {
                            txn.executeSql('INSERT INTO table_roles (sortie_id, role_name, role_type) VALUES(? ,? ,?)',
                                        [results.insertId, roleVals[roleKeys[x]]['name'], roleVals[roleKeys[x]]['title']],
                                        (tx, results) => {
                                            roleIds[roleKeys[x]] = results.insertId;
                                            x++;
                                            if(x < roleKeys.length) {
                                                loopInsert();
                                            }
                                            else {
                                                console.log(roleIds);
                                                if(this.state.gridVals) {
                                                    this.props.navigation.navigate("PreMission", {
                                                        roleIds: roleIds,
                                                        gridVals: this.state.gridVals,
                                                        sortieID: sortieId,
                                                        eventID: this.navParams.eventID,
                                                        missionID: this.navParams.missionID,
                                                        flow: this.navParams.flow
                                                    });
                                                }
                                                else {
                                                    let gridVals = {
                                                        premission: [],
                                                        mission: [],
                                                        postmission: []
                                                    };
                                                    this.props.navigation.navigate("PreMission", {
                                                        gridVals: gridVals,
                                                        roleIds: roleIds,
                                                        sortieID: sortieId,
                                                        eventID: this.navParams.eventID,
                                                        missionID: this.navParams.missionID,
                                                        flow: this.navParams.flow
                                                    });
                                                }
                                            }
                                        })
                        }.bind(this);
                        loopInsert();
                    }, (error) => {
                        Alert.alert(
                            'Error',
                            'Sortie Name Already Exists',
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

    _onAddRolePress() {
        this.setState((state) => {
            return {
                formVal: this.refs.form.getValue(),
                roleCount: state.roleCount + 1,
                roleVal: this.getRoleVals()
            };
        });
    }

    _onRemoveRolePress() {
        this.setState((state) => {
            return {
                formVal: this.refs.form.getValue(),
                roleCount: state.roleCount - 1,
                roleVal: this.getRoleVals()
            };
        });
    }

    getRoleVals() {
        let roleVals = {};
        console.log(this.refs);
        for(let i = 1; i<=this.state.roleCount; i++) {
            let roleName = "Role " + i.toString();
            let roleVal = this.refs[roleName].getValue();
            if(roleVal)
                roleVals[roleName] = {
                    name: roleVal.name,
                    title: roleVal.title
                }
        }
        console.log(roleVals);
        return roleVals
    }

    validateRoles() {
        for(let i = 1; i<=this.state.roleCount; i++) {
            let roleName = "Role " + i.toString();
            let roleVal = this.refs[roleName].getValue();
            if(roleVal == null )
                return false;
        }
        return true;
    }

    render() {
        const {navigate} = this.props.navigation;
        let roles = ["Role 1"];
        for(let i = 2; i<=this.state.roleCount; i++){
            roles.push("Role " + i.toString())
        }

        let Role = t.struct({
            name: t.String,
            title: t.enums( ROLE_MAPS[this.navParams.missionType] )
        });

        const options = {
            fields: {
                sessionName: {
                    error: "Session name cannot be empty",
                    autoFocus: true,
                    selectTextOnFocus: true
                },
                name: {
                    error: "Please enter name"
                }
            }
        };

        return (
            <KeyboardAvoidingView style = {{flex: 1}} behavior="padding" enabled>
                <ScrollView style = {styles.formContainer}>
                     <Form
                        ref="form"
                        type={this.state.type}
                        options={this.state.options}
                        value={this.state.formVal}
                    />
                    {!this.state.sortieCreated &&
                    <View>
                        {roles.map((roleName) => {
                            return(
                                <View key={roleName}>
                                    <Text style={{textAlign: 'center', fontSize: 22}}> {roleName} </Text>
                                    <Form type={Role} options={options} ref={roleName} value={this.state.roleVal[roleName]}/>
                                </View>
                            )
                        })}
                        <View style={{paddingBottom: 20}}>
                            <Button title="Add Role" onPress={this._onAddRolePress.bind(this)}> </Button>
                            <Button title="Remove Role" onPress={this._onRemoveRolePress.bind(this)} disabled={this.state.roleCount == 1}> </Button>
                        </View>
                    </View>}
                </ScrollView>
                <StickyFooter cancelFunc = {this._onCancelPressButton.bind(this)} proceedFunc = {this._onProceedPressButton.bind(this)}/>
            </KeyboardAvoidingView>
        );
    }
}

let styles = StyleSheet.create({
    formContainer: {
        flex: .7,
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 25,
        marginBottom: 30
    },
    roleButtonsContainer: {
        
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});