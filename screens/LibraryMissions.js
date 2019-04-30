import React, { Component } from 'react';
import { View, ActivityIndicator, ScrollView, StyleSheet, AsyncStorage, FlatList} from 'react-native';
import { ListItem, List } from 'react-native-elements';
import { openDatabase } from 'react-native-sqlite-storage';
let db = openDatabase({ name: 'HRTODatabase.db' });
import {FLOWS} from "../apis/values";

export default class LibraryMissions extends Component {
    static navigationOptions = {
        title: 'Missions Library',
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
            txn.executeSql("SELECT * FROM table_missions WHERE event_id = ?", [this.navParams.eventID], (txn, results) => {
                let stores = [];
                for(let x = 0; x < results.rows.length; x++) {
                    let tempVal = {
                        key: {
                            missionId: results.rows.item(x).mission_id,
                            missionName: results.rows.item(x).mission_name
                        }
                    };
                    stores.push(tempVal);
                }
                this.setState(previousState => ({
                    data: stores
                }))
            })
        });
        // AsyncStorage.getAllKeys((err, keys) => {
        //     AsyncStorage.multiGet(keys, (err, stores) => {
        //         this.setState(previousState => ({
        //             missionKeys: keys,
        //             data: stores
        //         }))
        //     });
        // });
    }

    _onRowClick(missionId) {
        console.log(this.navParams.flow);
        this.props.navigation.navigate("LibrarySorties", {missionID: missionId, flow: this.navParams.flow});
    }

    _onNewFlightClick() {
        this.props.navigation.navigate("MissionSetup", {eventID: this.navParams.eventID, flow: this.navParams.flow});
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
                title={"New Mission"}
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
                                title={item.key.missionName}
                                onPress={() => this._onRowClick(item.key.missionId)}
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