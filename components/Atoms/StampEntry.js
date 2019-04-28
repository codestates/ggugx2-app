import React, { Component } from 'react';
import { View, Image, Dimensions } from 'react-native';

export default class StampEntry extends Component {
  render() {
    const stampImgChecked = require('../../assets/images/stamp-checked.png');
    const stampImgUnchecked = require('../../assets/images/stamp-unchecked.png');
    const { isChecked } = this.props;
    const width = Dimensions.get('window').width;
    // const stampSize = 65;
    const stampSize = width * 0.17;
    return (
      <View
        style={{
          marginVertical: 3
        }}
      >
        <Image
          source={isChecked ? stampImgChecked : stampImgUnchecked}
          style={{ width: stampSize, height: stampSize }}
        />
      </View>
    );
  }
}
