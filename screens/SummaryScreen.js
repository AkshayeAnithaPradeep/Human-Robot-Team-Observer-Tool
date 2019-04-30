import React, { Component } from 'react';
import {View, StyleSheet, Dimensions, Share, ActivityIndicator} from 'react-native';
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';
import SummaryTable from './subviews/SummaryTable';
import SummaryDetails from './subviews/SummaryDetails';
import StickyFooter from "./subviews/StickyFooter";
import SummaryStatistics from "./subviews/SummaryStatistics";
import {FLOWS} from "../apis/values";
import {generateSummaryData} from "../apis/helper";
import { openDatabase } from 'react-native-sqlite-storage';
let db = openDatabase({ name: 'HRTODatabase.db' });

let converter = require('json-2-csv');

var {height, width} = Dimensions.get('window');

export default class SummaryScreen extends Component {
    state = {
        index: 0,
        routes: [
            { key: 'first', title: 'Details' },
            { key: 'second', title: 'Timestamps' },
            { key: 'third', title: 'Statistics'}
        ],
    };

    navParams = this.props.navigation.state.params;
    csvStringData = null;


    static navigationOptions = {
        title: 'Summary',
        headerStyle: {
            backgroundColor: '#500000',
        },
        headerTintColor: '#fff'
    };

    constructor(props) {
        super(props);
        generateSummaryData(this.navParams.sortieID, db).then((summaryData) => {
            this.setState({
                ready: true,
                summaryData: summaryData
            });
            this._setJsonString(summaryData);
        })
    }

    _setJsonString(data) {
        converter.json2csv(data, (err, csv) => {
            this.csvStringData = csv;
            console.log(csv);
        });
    }

    _onCancelPressButton() {
        Share.share({
            message: this.csvStringData,
            title: this.state.summaryData.sortieName + ' Result'
        }, {
            // Android only:
            dialogTitle: 'Share Result'
        })
    }
    _onProceedPressButton() {
        this.props.navigation.navigate("Home");
    }

    render() {
        let footerButtonText = this.navParams.flow === FLOWS.LIBRARY? "Main Menu" : "End Mission";
        if(this.state && this.state.ready) {
            return (
                <View style={{flex: 1}}>
                    <TabView
                        navigationState={this.state}
                        renderScene={({route}) => {
                            switch (route.key) {
                                case 'first':
                                    return <SummaryDetails setupData={this.state.summaryData}
                                                           navigation={this.props.navigation}
                                                           setJsonStringData={this._setJsonString.bind(this)}/>;
                                case 'second':
                                    return <SummaryTable setupData={this.state.summaryData}
                                                         navigation={this.props.navigation}/>;
                                case 'third':
                                    return <SummaryStatistics setupData={this.state.summaryData}
                                                              navigation={this.props.navigation}/>;
                                default:
                                    return null;
                            }
                        }}
                        onIndexChange={index => this.setState({index})}
                        initialLayout={{width: Dimensions.get('window').width}}
                        renderTabBar={props =>
                            <TabBar
                                {...props}
                                labelStyle={{fontSize: 8 + (width / 100), color: '#000'}}
                                indicatorStyle={{backgroundColor: 'pink'}}
                                style={{ backgroundColor: '#8CB5CF' }}
                            />
                        }
                    />
                    <StickyFooter cancelFunc={this._onCancelPressButton.bind(this)}
                                  proceedFunc={this._onProceedPressButton.bind(this)} backVal={"Share Results"}
                                  proceedVal={footerButtonText}/>
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

const styles = StyleSheet.create({
    scene: {
        flex: 1,
    },
});