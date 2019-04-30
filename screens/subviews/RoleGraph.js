import React, {Component} from 'react';
import {View, Text, Dimensions} from 'react-native';
import { StackedBarChart, XAxis, Grid } from 'react-native-svg-charts';
import {rowVals} from "../../apis/values";


var {height, width} = Dimensions.get('window');

export default class RoleGraph extends Component {

    render() {

        let data = [];
        let keys = new Set();
        for(let i =0; i < rowVals.length; i++){
            let temp = {
                observation: rowVals[i].slice(0, 9)
            };
            for(let x in this.props.data) {
                if(!this.props.data.hasOwnProperty(x)) continue;
                let countArr = this.props.data[x];
                temp[x] = countArr[i];
                keys.add(x);
            }
            data.push(temp)
        }
        keys = [...keys];

        const colors = [ '#fc3d39', '#53d769',  '#147efb', '#fd9426', '#5fc9f8' ];

        function getFormattedLabel(string) {
            if(string.length < 9)
                return string;
            else
                return string.slice(0, 7) + '..';
        }

        return (
            <View style={{padding: 5}}>
                <View style={{ height: 200 }}>
                    <StackedBarChart
                        style={{ flex: 1 }}
                        keys={ keys }
                        colors={ colors.slice(0, keys.length) }
                        data={ data }
                        gridMin={ 0 }
                        showGrid={true}
                        contentInset={{ top: 10, bottom: 10 }}
                        animate={true}
                    >
                        <Grid/>
                    </StackedBarChart>
                    <XAxis
                        data={ rowVals }
                        formatLabel={ (value, index) => getFormattedLabel(rowVals[index]) }
                        contentInset={{ left: 25, right: 25 }}
                        svg={{ fontSize: 3 + width/100, fill: 'black' }}
                    />
                </View>
                <View style={{flex:1, flexDirection: 'row', justifyContent: 'center'}}>
                    {keys.map((key, index) => {
                        return (
                            <View style={{flex: 1, flexDirection: 'row', padding: 10}}>
                                <View style={{flex:1, backgroundColor: colors[index]}}/>
                                <Text style={{flex:3, paddingLeft: 10, fontSize: 15-keys.length}}>{this.props.roleData[index].name}</Text>
                            </View>
                        );
                    })}
                </View>
            </View>
        )
    }

}