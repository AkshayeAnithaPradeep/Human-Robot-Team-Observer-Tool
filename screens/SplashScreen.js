import React from 'react';
import {View, Text, Image, Dimensions} from 'react-native';

var {height, width} = Dimensions.get('window');

class SplashScreen extends React.Component {
    performTimeConsumingTask = async() => {
        return new Promise((resolve) =>
            setTimeout(
                () => { resolve('result') },
                2000
            )
        )
    };

    async componentDidMount() {
        // Preload data from an external API
        // Preload data using AsyncStorage
        const data = await this.performTimeConsumingTask();

        if (data !== null) {
            this.props.navigation.navigate('App');
        }
    }

    render() {
        return (
            <View style={styles.viewStyles}>
                <View style={styles.textViewBoxStyle}>
                    <Text style={styles.textHeaderStyles}>
                        Human-Robot Team Observation Tool
                    </Text>
                    <Text style={styles.textTagStyles}>
                        See hrt.hrail.crasar.org for more info
                    </Text>
                </View>
                <View style={styles.imageViewStyle}>
                    <Image style={{flex:1, resizeMode: 'contain'}} source={require('./../res/TRCLogo.gif')} />
                    <Image style={{flex:1, resizeMode: 'contain'}} source={require('./../res/crasar.jpeg')} />
                </View>
                <Image style={styles.imageStyle} source={require('./../res/tees.png')} />
            </View>
        );
    }
}

const styles = {
    viewStyles: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: 'white'
    },
    imageViewStyle: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: 20,
        flexDirection: 'row'
    },
    textHeaderStyles: {
        color: '#500000',
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    textTagStyles: {
        color: '#000',
        fontSize: 15,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    textViewBoxStyle: {
        flex: 3,
        justifyContent: 'center'
    },
    imageStyle: {
        flex: 1,
        padding: 10,
        resizeMode: 'center'
    },
};

export default SplashScreen;