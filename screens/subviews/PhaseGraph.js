import React, {Component} from 'react';
import {Dimensions, Text, View} from 'react-native';
import { StackedBarChart, XAxis, Grid } from 'react-native-svg-charts';
import {rowVals} from "../../apis/values";


var {height, width} = Dimensions.get('window');

export default class PhaseGraph extends Component {

    render() {
        let data = [];
        let keys = new Set();
        for(let i =0; i < rowVals.length; i++){
            let temp = {
                observation: rowVals[i]
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
        console.log(keys);
        console.log(data);

        const colors = [ '#fecb2e', '#7d3f98',  '#2c9f45'];

        function getFormattedLabel(string) {
            if(string.length < 9)
                return string;
            else
                return string.slice(0, 8) + '..';
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
                                <Text style={{flex:3, paddingLeft: 10, fontSize: 15-keys.length}}>{keys[index]}</Text>
                            </View>
                        );
                    })}
                </View>
            </View>
        )
    }

}