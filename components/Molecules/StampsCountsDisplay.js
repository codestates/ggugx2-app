import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-elements';

const s = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    alignItems: 'baseline',
    justifyContent: 'flex-end',
    paddingRight: 10
  },
  stampsText: {
    fontWeight: 'bold',
    fontSize: 34,
    color: '#e34235'
  },
  REQUIREDText: {
    fontSize: 25,
    color: '#666',
    marginLeft: 8,
    paddingBottom: 2
  }
});

// 모은 스탬프 수 / 교환에 필요한 개수 텍스트로 표현해주는 컴포넌트
export default class StampsCountsDisplay extends Component {
  render() {
    const { stamps, REQUIRED } = this.props.stampsCounts;
    return (
      <View style={s.container}>
        <Text style={s.stampsText}>{stamps}</Text>
        <Text style={s.REQUIREDText}>/ {REQUIRED}</Text>
      </View>
    );
  }
}
