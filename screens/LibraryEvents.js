import React, { Component } from 'react';
import { View, ActivityIndicator, ScrollView, StyleSheet, AsyncStorage, FlatList} from 'react-native';
import { ListItem, List } from 'react-native-elements';
import { openDatabase } from 'react-native-sqlite-storage';
let db = openDatabase({ name: 'HRTODatabase.db' });

export default class LibraryEvents extends Component {
    static navigationOptions = {
        title: 'Events Library',
        headerStyle: {
            backgroundColor: '#500000',
        },
        headerTintColor: '#fff'
    };

    constructor(props) {
        super(props);
        this._onRowClick = this._onRowClick.bind(this);
    }

    componentDidMount() {
        db.transaction((txn) => {
            txn.executeSql("SELECT * FROM table_events", [], (txn, results) => {
                let stores = [];
                for(let x = 0; x < results.rows.length; x++) {
                    let tempVal = {
                        key: {
                            eventId: results.rows.item(x).event_id,
                            eventName: results.rows.item(x).event_name
                        }
                    };
                    stores.push(tempVal);
                }
                console.log(stores);
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

    _onRowClick(eventId) {
        this.props.navigation.navigate("LibraryMissions", {eventID: eventId, flow: this.props.navigation.state.params.flow});
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
        if(this.state && this.state.data) {
            return (
                <ScrollView>
                    <FlatList
                        data={this.state.data}
                        renderItem={({item}) => (
                            <ListItem
                                title={item.key.eventName}
                                onPress={() => this._onRowClick(item.key.eventId)}
                                rightIcon={{name: 'chevron-right'}}
                            />
                        )}
                        ItemSeparatorComponent={this.renderSeparator}
                    />
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