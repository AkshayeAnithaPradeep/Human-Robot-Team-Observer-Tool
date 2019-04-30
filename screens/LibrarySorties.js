import React, { Component } from 'react';
import { View, ActivityIndicator, ScrollView, StyleSheet, AsyncStorage, FlatList} from 'react-native';
import { ListItem, List } from 'react-native-elements';
import { openDatabase } from 'react-native-sqlite-storage';
let db = openDatabase({ name: 'HRTODatabase.db' });
import {FLOWS, STEPS} from "../apis/values";

export default class LibrarySorties extends Component {
    static navigationOptions = {
        title: 'Sorties Library',
        headerStyle: {
            backgroundColor: '#500000',
        },
        headerTintColor: '#fff'
    };

    navParams = this.props.navigation.state.params;

    constructor(props) {
        super(props);
        this._onRowClick = this._onRowClick.bind(this);
        this._onNewFlightClick = this._onNewFlightClick.bind(this);
    }

    componentDidMount() {
        db.transaction((txn) => {
            txn.executeSql("SELECT * FROM table_sorties WHERE mission_id = ?", [this.navParams.missionID], (txn, results) => {
                let stores = [];
                for(let x = 0; x < results.rows.length; x++) {
                    let tempVal = {
                        key: {
                            sortieId: results.rows.item(x).sortie_id,
                            sortieName: results.rows.item(x).sortie_name
                        }
                    };
                    stores.push(tempVal);
                }
                this.setState(previousState => ({
                    data: stores
                }))
            })
        });
    }

    _onRowClick(sortieId) {
        if(this.navParams.flow === FLOWS.RESUME ) {
            db.transaction((txn) => {
                txn.executeSql("SELECT * FROM table_roles WHERE sortie_id = ?", [sortieId], (txn, results)=> {
                    let roleIds = {};
                    let invRoleIds = {};
                    let count = results.rows.length;
                    for(let i = 0; i < count; i++){
                        let roleName = "Role " + (i+1).toString();
                        roleIds[roleName] = results.rows.item(i).role_id;
                        invRoleIds[results.rows.item(i).role_id] = roleName;
                    }
                    let tempgridVals = [];
                    for(let i=0; i<10; i++) {
                        let temp = [];
                        for(let j=0;j<count;j++){
                            temp.push(0);
                        }
                        tempgridVals.push(temp)
                    }
                    let gridVals = {
                        premission: JSON.parse(JSON.stringify(tempgridVals)),
                        mission: JSON.parse(JSON.stringify(tempgridVals)),
                        postmission: JSON.parse(JSON.stringify(tempgridVals))
                    };
                    txn.executeSql("SELECT * FROM table_observations WHERE sortie_id = ?", [sortieId], (txn, results) => {
                        console.log(invRoleIds);
                        for(let k = 0; k < results.rows.length; k++) {
                            let i = results.rows.item(k).event;
                            let j = parseInt(invRoleIds[results.rows.item(k).role_id].substr(5)) - 1;
                            switch(results.rows.item(k).step) {
                                case STEPS.PRE_MISSION:
                                    gridVals.premission[i][j] += 1;
                                    break;
                                case STEPS.MISSION_EXECUTION:
                                    gridVals.mission[i][j] += 1;
                                    break;
                                case STEPS.POST_MISSION:
                                    gridVals.postmission[i][j] += 1;
                                    break;
                            }
                        }
                        this.props.navigation.navigate("PreMission", {gridVals: gridVals, roleIds: roleIds, sortieID: sortieId, eventID: this.navParams.eventID, missionID: this.navParams.missionID, flow: FLOWS.RESUME});
                    })
                })
            });
        } else {
            this.props.navigation.navigate("Summary", {sortieID: sortieId, flow: this.props.navigation.state.params.flow});
        }
    }

    _onNewFlightClick() {
        db.transaction((txn) => {
            txn.executeSql("SELECT * FROM table_missions WHERE mission_id =?", [this.navParams.missionID], (txn, results) => {
                this.props.navigation.navigate("SortieSetup", {missionID: this.navParams.missionID, missionType: results.rows.item(0).mission_type, flow: this.navParams.flow});
            })
        });
    }

    renderSeparator = () => {
        return (
            <View
                style={{
                    height: 1,
                    width: "100%",
                    backgroundColor: "#CED0CE"
                }}
            />
        );
    };

    render() {
        let addNew;
        if(this.navParams.flow === FLOWS.RESUME ) {
            addNew = <ListItem
                title={"New Sortie"}
                leftIcon={{name: 'add'}}
                style={{borderStyle: 'solid', borderColor: '#CED0CE', borderWidth: 1}}
                onPress={() => this._onNewFlightClick()}
            />;
        }
        else {
            addNew = <View/>;
        }
        if(this.state && this.state.data) {
            return (
                <ScrollView>
                    <FlatList
                        data={this.state.data}
                        renderItem={({item}) => (
                            <ListItem
                                title={item.key.sortieName}
                                onPress={() => this._onRowClick(item.key.sortieId)}
                                rightIcon={{name: 'chevron-right'}}
                            />
                        )}
                        ItemSeparatorComponent={this.renderSeparator}
                    />
                    {addNew}
                </ScrollView>
            );
        }
        else
            return (
                <View style={styles.container}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});