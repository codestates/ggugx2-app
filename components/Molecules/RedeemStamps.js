import React, { Component } from 'react';
import { View } from 'react-native';
import { Text, Image } from 'react-native-elements';

export default class RedeemStamps extends Component {
  render() {
    const stampImgChecked = require('../../assets/images/stamp-checked.png');
    const stampSize = 50;
    return (
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'nowrap',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 5
        }}
      >
        <Image
          source={stampImgChecked}
          style={{ width: stampSize, height: stampSize }}
        />
        <Text h4> x [10] = </Text>
        <Text h4>[아메리카노]</Text>
        <Text h3> ⑤</Text>
      </View>
    );
  }
}
