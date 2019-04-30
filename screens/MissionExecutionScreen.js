import React, { Component } from 'react';
import {ActivityIndicator, Button, ScrollView, StyleSheet, View} from 'react-native';
import { Icon } from 'react-native-elements';
import StickyFooter from "./subviews/StickyFooter";
import Grid from "./subviews/Grid";
import TableCell from "./subviews/TableCell";
import {FLOWS, STEPS} from "../apis/values";
import {getRoleHeaders} from "../apis/helper";
import { openDatabase } from 'react-native-sqlite-storage';
let db = openDatabase({ name: 'HRTODatabase.db' });

export default class MissionExecutionScreen extends Component {

    navParams = this.props.navigation.state.params;
    last_pressed = [];
    last_insertId = [];

    constructor(props) {
        super(props);
        let count = Object.keys(this.navParams.roleIds).length;
        // let data = this.navParams.setupData;
        // for(let x in data) {
        //     if (!data.hasOwnProperty(x)) continue;
        //     if(x.startsWith('role') && data[x] != null){
        //         count++;
        //     }
        // }
        let gridVals = [];
        for(let i=0; i<10; i++) {
            let temp = [];
            for(let j=0;j<count;j++){
                temp.push(0);
            }
            gridVals.push(temp)
        }
        let existGridVals = this.navParams.gridVals.mission;
        if(existGridVals.length)
            gridVals = existGridVals.slice();
        this.navParams.gridVals.mission = gridVals;
        getRoleHeaders.call(this, this.navParams.roleIds, db).then((roleData) => {
            console.log(roleData);
            this.setState({
                ready: true,
                roleHeaders: roleData,
                colCount : 1 + count,
                rowCount : 10,
                gridVals : gridVals
            });
        });
        this._onGridCellPress = this._onGridCellPress.bind(this);
    }

    componentDidMount() {
        this.props.navigation.setParams({ _onUndoPressButton: this._onUndoPressButton.bind(this) });
    }

    static navigationOptions = ({ navigation }) => {
        return {
            title: 'Mission Execution',
            headerStyle: {
                backgroundColor: '#500000',
            },
            headerTintColor: '#fff',
            headerRight: (
                <View style={{paddingRight: 5}}>
                    <Icon
                        raised
                        name='undo'
                        type='material-community'
                        size={20}
                        color='black'
                        underlayColor='blue'
                        onPress={navigation.getParam('_onUndoPressButton')}
                    />
                </View>
            ),
            headerLeft: (
                <Button
                    onPress={() => {
                        navigation.navigate("PreMission", {sortieID: navigation.state.params.sortieID, eventID: navigation.state.params.eventID, missionID: navigation.state.params.missionID, flow: FLOWS.BACK_PRESS});
                    }}
                    title="Back"
                    color="#fff"
                />
            )
        }
    };

    _onGridCellPress(i,j) {
        let gridVals = this.state.gridVals;
        gridVals[i][j] += 1;
        this.last_pressed.push({
            x: i,
            y: j
        });
        let roleName = "Role " + (j+1).toString();
        db.transaction((txn) => {
            txn.executeSql("INSERT INTO table_observations (role_id, sortie_id, timestamp, step, event) VALUES(? ,? ,? ,? ,?)",
                [this.navParams.roleIds[roleName], this.navParams.sortieID, new Date().getTime(), STEPS.MISSION_EXECUTION, i], (txn, results) => {
                    console.log('Results', results.insertId);
                    this.last_insertId.push(results.insertId);
                    this.setState(prevState => ({
                        gridVals: [...prevState.gridVals, gridVals]
                    }));
                })
        });
        // let data = this.state.data;
        // let sortieName = data.sortieName;
        // AsyncStorage.getItem(data.missionName + '-' + data.sessionName, (err, result) => {
        //     result = JSON.parse(result);
        //     if(result && result.sorties[sortieName].timeStamps) {
        //         let newTimeStamps = result.sorties[sortieName].timeStamps.slice();
        //         let temp = {
        //             timeStamp: new Date().getTime(),
        //             step: 'premission',
        //             event: i,
        //             role: j
        //         };
        //         newTimeStamps.push(temp);
        //         result.sorties[sortieName].timeStamps = newTimeStamps;
        //         AsyncStorage.mergeItem(data.missionName + '-' + data.sessionName, JSON.stringify(result), () => {
        //             this.setState(prevState => ({
        //                 gridVals: [...prevState.gridVals, gridVals]
        //             }));
        //         });
        //     }
        // });
    }

    _onCancelPressButton() {
        this.props.navigation.navigate("PreMission", {sortieID: this.navParams.sortieID, eventID: this.navParams.eventID, missionID: this.navParams.missionID, flow: FLOWS.BACK_PRESS});
    }
    _onProceedPressButton() {
        this.props.navigation.navigate("PostMission", {gridVals: this.navParams.gridVals, roleIds: this.navParams.roleIds, sortieID: this.navParams.sortieID, eventID: this.navParams.eventID, missionID: this.navParams.missionID});
    }

    _onUndoPressButton() {
        let lastPressed = this.last_pressed.pop();
        let lastInsertedId = this.last_insertId.pop();
        if(lastPressed) {
            db.transaction((txn) => {
                txn.executeSql("DELETE FROM table_observations WHERE observation_id = ?", [lastInsertedId], (txn,result) => {
                    let gridVals = this.state.gridVals;
                    gridVals[lastPressed.x][lastPressed.y] -= 1;
                    this.setState(prevState => ({
                        gridVals: [...prevState.gridVals, gridVals]
                    }));
                })
            });
            // let gridVals = this.state.gridVals;
            // gridVals[lastPressed.x][lastPressed.y] -= 1;
            // let data = this.state.data;
            // let sortieName = data.sortieName;
            // AsyncStorage.getItem(data.missionName + '-' + data.sessionName, (err, result) => {
            //     result = JSON.parse(result);
            //     if (result && result.sorties[sortieName].timeStamps) {
            //         let newTimeStamps = result.sorties[sortieName].timeStamps.slice();
            //         newTimeStamps.pop();
            //         result.sorties[sortieName].timeStamps = newTimeStamps;
            //         AsyncStorage.mergeItem(data.missionName + '-' + data.sessionName, JSON.stringify(result), () => {
            //             this.setState(prevState => ({
            //                 gridVals: [...prevState.gridVals, gridVals]
            //             }));
            //         });
            //     }
            // });
        }
    }

    render() {
        if(this.state && this.state.ready) {
            return (
                <View style={{flex: 1}}>
                    <ScrollView style={styles.formContainer}>
                        <View style={{flex: 1}}>
                            <View>
                                <View style={{flex: 1, flexDirection: 'row', height: 50}}>
                                    <TableCell id={0} flexVal={this.state.colCount}> </TableCell>
                                    {this.state.roleHeaders.map((roleHeader, index) => {
                                        return <TableCell key={index} id={0}
                                                          flexVal={this.state.colCount}>{roleHeader} </TableCell>
                                    })}
                                </View>
                            </View>
                            <View>
                                <Grid colCount={this.state.colCount} gridVals={this.state.gridVals}
                                      gridCellPress={this._onGridCellPress}/>
                            </View>
                        </View>
                    </ScrollView>
                    <StickyFooter cancelFunc={this._onCancelPressButton.bind(this)}
                                  proceedFunc={this._onProceedPressButton.bind(this)}/>
                </View>
            );
        } else {
            return (
                <View style={styles.container}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            )
        }
    }
}

let styles = StyleSheet.create({
    formContainer: {
        flex: .8
    },
    undoButton: {
        paddingRight: 5
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});


