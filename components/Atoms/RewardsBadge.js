import React, { Component } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-elements';
import axios from '../../modules/axios-connector';
import socket from '../../modules/socket-connector';

export default class rewardsBadge extends Component {
  render() {
    const badgeSize = 50;
    const fontSize = 30;
    const rewards = this.props.rewards;
    // let rewards; // 여러자리 숫자 표현할 충분한 자리가 있으니 굳이 이러지 말자.
    // if (this.props.rewards === null) {
    //   rewards = 'x';
    // } else if (this.props.rewards > 9) {
    //   rewards = '9+';
    // } else {
    //   rewards = this.props.rewards;
    // }

    return (
      <TouchableOpacity
        onPress={() => {
          this.props.onPress();
        }}
      >
        <View
          style={{
            height: badgeSize,
            minWidth: badgeSize,
            maxWidth: 80,
            overflow: 'hidden',
            borderRadius: '100%',
            backgroundColor: '#e34235',
            justifyContent: 'center',
            alignItems: 'center',
            margin: 5,
            padding: 10,
            paddingVertical: 0
          }}
        >
          <Text style={{ color: 'white', fontWeight: 'bold', fontSize }}>
            {rewards}
          </Text>
        </View>
        {/* <Text>FIXME:가게ID:{this.props.storeID}</Text> */}
      </TouchableOpacity>
    );
  }
}
