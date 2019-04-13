import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import { Text } from 'react-native-elements';
import { Stamps } from '../components/Molecules/Stamps';

export default class StampsScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam('storeName'),
      headerTitleStyle: {
        fontSize: 20
      }
    };
  };
  render() {
    const { storeName, distance, stamps } = this.props.navigation.state.params;
    return (
      <ScrollView style={{ flex: 1 }}>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'nowrap',
            alignItems: 'baseline',
            justifyContent: 'flex-end',
            paddingRight: 10
          }}
        >
          <Text style={{ fontWeight: 'bold', fontSize: 20, color: '#e34235' }}>
            {stamps}
          </Text>
          <Text> / 10</Text>
        </View>
        {/* <Stamps /> */}

        <Text>{distance}</Text>
        <Text>{storeName}</Text>
      </ScrollView>
    );
  }
}
