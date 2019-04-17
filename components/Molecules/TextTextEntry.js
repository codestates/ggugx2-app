import React, { Component } from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-elements';

// 하나의 메뉴 이름, 메뉴 가격을 props로 받아 화면에 표현하는 컴포넌트
export default class TextTextEntry extends Component {
  render() {
    const { LEFT, RIGHT } = this.props.list;
    const SUFFIX = this.props.suffix;
    const { styleLeft, styleRight } = this.props;
    return (
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'nowrap',
          alignItems: 'stretch',
          width: '100%'
        }}
      >
        <Text style={{ flex: 2.5, borderWidth: 1, ...styleLeft }}>{LEFT}</Text>
        <Text
          style={{
            flex: 1,
            borderWidth: 1,
            textAlign: 'right',
            ...styleRight
          }}
        >
          {RIGHT}
          {SUFFIX}
        </Text>
      </View>
    );
  }
}
