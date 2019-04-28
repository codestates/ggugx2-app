import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import { Text } from 'react-native-elements';
import StampEntry from '../Atoms/StampEntry';

export default class StampsPaper extends Component {
  render() {
    const { REQUIRED, stamps } = this.props.stampsObject;
    const coupons = [];

    for (let i = 0; i < stamps; i++) {
      coupons.push(true);
    }
    for (let i = 0; i < REQUIRED - stamps; i++) {
      coupons.push(false);
    }

    return (
      <ScrollView
        style={{
          width: '90%',
          borderWidth: 1,
          borderColor: 'gray',
          borderRadius: 10,
          height: 152,
          backgroundColor: '#eee',
          alignSelf: 'center'
        }}
      >
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-around',
            padding: 5
          }}
        >
          {coupons.map((stamp, i) => (
            <StampEntry isChecked={stamp} key={i} />
          ))}
        </View>
      </ScrollView>
    );
  }
}
