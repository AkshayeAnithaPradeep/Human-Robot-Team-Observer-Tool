import React, {Component} from 'react';
import {AsyncStorage, Text, View, ScrollView, StyleSheet, Share, ActivityIndicator} from 'react-native';
import TableCell from "./TableCell";
import StickyFooter from "./StickyFooter";
import {rowVals} from "../../apis/values";

const phases = ['premission', 'mission', 'postmission'];

export default class SummaryTable extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        let data = this.props.setupData;
        let sortieName = data.sortieName;
        // AsyncStorage.getItem(data.missionName + '-' + data.sessionName, (err, result) => {
        //     result = JSON.parse(result);
        //     this.setState(previousState => ({
        //         data: result,
        //         sortieName: sortieName,
        //         initDate: new Date(result.sorties[sortieName].timeStamps[0].timeStamp)
        //     }))
        // });
        this.setState(previousState => ({
            data: data,
            sortieName: sortieName,
            initDate: new Date(data.timeStamps[0].timeStamp)
        }))
    }

    static navigationOptions = {
        title: 'Summary'
    };

    render() {
        if (this.state && this.state.data)
            return (
                <ScrollView style={{flex: 1}}>
                    <View style={{flex: 1}}>
                        <View style={{flex: 1, flexDirection: 'row', height: 35}}>
                            <TableCell id={0} flexVal={5}>Time</TableCell>
                            <TableCell id={0} flexVal={5}>Phase</TableCell>
                            <TableCell id={0} flexVal={5}>Event</TableCell>
                            <TableCell id={0} flexVal={5}>Name</TableCell>
                            <TableCell id={0} flexVal={5}>Role</TableCell>
                        </View>
                        {this.state.data.timeStamps.map((timeStampObj, index) => {
                            // let timeStampObj = this.state.data.sorties[this.state.sortieName].timeStamps[index];
                            let timeStamp = timeStampObj.timeStamp;
                            let time = new Date(timeStamp).toTimeString().slice(0, 8);
                            // let roleKey = "role_" + (timeStampObj.role + 1);
                            // if (index !== 0)
                            return (
                                <View key={index} style={{flex: 1, flexDirection: 'row', height: 50}}>
                                    <View style={[styles.textContainer, {borderRightColor: '#CED0CE'}]}>
                                        <Text style={styles.text}>
                                            {time}
                                        </Text>
                                    </View>
                                    <View style={styles.textContainer}>
                                        <Text style={styles.text}>
                                            {phases[timeStampObj.step-1]}
                                        </Text>
                                    </View>
                                    <View style={styles.textContainer}>
                                        <Text style={styles.text}>
                                            {rowVals[timeStampObj.event]}
                                        </Text>
                                    </View>
                                    <View style={styles.textContainer}>
                                        <Text style={styles.text}>
                                            {timeStampObj.name}
                                        </Text>
                                    </View>
                                    <View style={styles.textContainer}>
                                        <Text style={styles.text}>
                                            {timeStampObj.role}
                                        </Text>
                                    </View>
                                </View>
                            );
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
        alignItems: 'flex-start',
        borderStyle: 'solid',
        borderBottomColor: '#CED0CE',
        borderBottomWidth: 2,
        padding: 1
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {
        fontSize: 12
    }
});