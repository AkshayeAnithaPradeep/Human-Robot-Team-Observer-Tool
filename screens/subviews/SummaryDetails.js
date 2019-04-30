import React, {Component} from 'react';
import {AsyncStorage, Text, View, ScrollView, StyleSheet, ActivityIndicator} from 'react-native';
import {getSummaryDetails} from './../../apis/helper';
import {ROLES_TYPES} from "../../apis/values";

export default class SummaryTable extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        let data = this.props.setupData;
        let sortieName = data.sortieName;
        // AsyncStorage.getItem(data.missionName + '-' + data.sessionName, (err, result) => {
        //     this.props.setJsonStringData(result);
        //     result = JSON.parse(result);
        //     let details = getSummaryDetails(result, sortieName);
        //     this.setState(previousState => ({
        //         data: details,
        //         initDate: new Date(result.sorties[sortieName].timeStamps[0].timeStamp)
        //     }))
        // });
        this.setState(previousState => ({
            data: data,
            initDate: new Date(data.timeStamps[0].timeStamp)
        }))
    }

    render() {
        if (this.state && this.state.data)
            return (
                <ScrollView style={{flex: 1}}>
                    <View style={{padding: 15}}>
                        <Text style={styles.keyText}>Event Name: <Text style={{fontWeight: 'normal'}}>{this.state.data.eventName}</Text></Text>
                        <Text style={styles.keyText}>Event Description: <Text style={{fontWeight: 'normal'}}>{this.state.data.eventDescription}</Text></Text>
                        <Text style={styles.keyText}>Mission Name: <Text style={{fontWeight: 'normal'}}>{this.state.data.missionName}</Text></Text>
                        <Text style={styles.keyText}>Mission Description: <Text style={{fontWeight: 'normal'}}>{this.state.data.missionDescription}</Text></Text>
                        <Text style={styles.keyText}>Mission Observations: <Text style={{fontWeight: 'normal'}}>{this.state.data.missionObservations}</Text></Text>
                        <Text style={styles.keyText}>Sortie: <Text style={{fontWeight: 'normal'}}>{this.state.data.sortieName}</Text></Text>
                        {this.state.data.sortieObservation && <Text style={styles.keyText}>Sortie Observations: <Text style={{fontWeight: 'normal'}}>{this.state.data.sortieObservation}</Text></Text>}
                        {this.state.data.sortieLocation && <Text style={styles.keyText}>Sortie Location: <Text style={{fontWeight: 'normal'}}>{this.state.data.sortieLocation}</Text></Text>}
                        {/*<Text style={styles.keyText}>Location: <Text style={{fontWeight: 'normal'}}>{this.state.data.location}</Text></Text>*/}
                        <Text style={styles.keyText}>Started on {this.state.initDate.toTimeString().slice(0, 8) + ' ' + this.state.initDate.toDateString()}</Text>
                        {this.state.data.roles.map((role, index) => {
                            return (
                                <View>
                                    <Text style={{fontWeight: 'bold', fontSize: 17}}>Role {index + 1}</Text>
                                    <Text style={styles.keyText}>Title: <Text style={{fontWeight: 'normal'}}>{ROLES_TYPES[role.title].value} </Text></Text>
                                    <Text style={styles.keyText}>Name: <Text style={{fontWeight: 'normal'}}>{role.name} </Text></Text>
                                </View>
                            )
                        })}
                    </View>
                </ScrollView>
            );
        else
            return (
                <View style={styles.container}>
                    <ActivityIndicator size="large" color="#0000ff"/>
                </View>
            )
    }
}

let styles = StyleSheet.create({
    textContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderStyle: 'solid',
        borderBottomColor: '#000000',
        borderBottomWidth: 0.5,
        borderLeftColor: '#000000',
        borderLeftWidth: 0.5
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    keyText: {
        fontWeight: 'bold',
        padding: 7
    }
});