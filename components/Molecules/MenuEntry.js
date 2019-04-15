import React, { Component } from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-elements';

// 하나의 메뉴 이름, 메뉴 가격을 props로 받아 화면에 표현하는 컴포넌트
export default class MenuEntry extends Component {
  render() {
    const { NAME, PRICE } = this.props.menu;
    return (
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'nowrap',
          alignItems: 'stretch',
          width: '100%'
        }}
      >
        <Text h4 style={{ flex: 2.5, borderWidth: 1 }}>
          {NAME}
        </Text>
        <Text h4 style={{ flex: 1, borderWidth: 1 }}>
          {PRICE}원
        </Text>
      </View>
    );
  }
}
