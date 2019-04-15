import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import { Text } from 'react-native-elements';
import StampEntry from '../Atoms/StampEntry';

export default class StampsPaper extends Component {
  render() {
    const { REQUIRED, count } = this.props.countsObject;
    const coupons = [];
    for (let i = 0; i < count; i++) {
      coupons.push(true);
    }
    for (let i = 0; i < REQUIRED - count; i++) {
      coupons.push(false);
    }
    return (
      <View
        style={{
          // width: '90%',
          // height: 200,
          backgroundColor: '#eee',
          alignSelf: 'center'
        }}
      >
        <View
          style={{ borderWidth: 1, flexDirection: 'row', flexWrap: 'wrap' }}
        >
          {coupons.map((stamp, i) => (
            <StampEntry isChecked={stamp} key={i} />
          ))}
        </View>
      </View>
    );
  }
}
