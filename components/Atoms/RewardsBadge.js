import React, { Component } from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-elements';

export default class rewardsBadge extends Component {
  render() {
    const badgeSize = 50;
    const fontSize = 30;
    let rewards;
    if (this.props.rewards === null) {
      rewards = 'x';
    } else if (this.props.rewards > 1000) {
      rewards = '99+';
    } else {
      rewards = this.props.rewards;
    }
    return (
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
    );
  }
}
