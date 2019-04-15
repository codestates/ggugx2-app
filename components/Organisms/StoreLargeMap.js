import React, { Component } from 'react';
import { Text, View } from 'react-native';

export default class StoreLargeMap extends Component {
  render() {
    return (
      <View
        style={{
          width: '90%',
          height: 200,
          backgroundColor: '#eee',
          justifyContent: 'center',
          alignItems: 'center',
          alignSelf: 'center'
        }}
      >
        <Text>지도</Text>
      </View>
    );
  }
}
