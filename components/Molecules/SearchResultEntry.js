import React, { Component } from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { Text } from 'react-native-elements';
import { Avatar } from 'react-native-elements';
// import {iconOpenPng} from '../../assets/images/icon-open.png'

export default class SearchResultEntry extends Component {
  render() {
    const {
      storeName,
      distance,
      stamps,
      isOpen,
      haveRewards,
      img
    } = this.props.itemObject;
    const { onPress } = this.props;
    const iconOpen = isOpen
      ? require('../../assets/images/icon-open.png')
      : require('../../assets/images/icon-closed.png');
    const iconRewards = haveRewards
      ? require('../../assets/images/icon-redeem.png')
      : require('../../assets/images/icon-redeem-x.png');
    const iconSize = 40;
    return (
      <TouchableOpacity
        style={{
          height: 100,
          borderWidth: 1,
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'flex-start'
        }}
        onPress={onPress}
      >
        {/* 왼쪽: 매장사진 */}
        <View
          style={{
            flex: 0,
            width: 100,
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Avatar size={90} rounded source={{ uri: img }} />
        </View>
        {/* 중간: 매장명, 거리, 스탬프수 */}
        <View
          style={{
            flex: 4,
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <Text style={{ fontSize: 20, fontWeight: 'bold', height: 30 }}>
            {storeName}
          </Text>
          <Text style={{ fontSize: 14, height: 20 }}>{distance}</Text>
          <Text style={{ fontSize: 14, height: 20 }}>{stamps}</Text>
          <Text style={{ fontSize: 14, height: 20 }}>
            {'검색한 메뉴 : 가격'}
          </Text>
        </View>
        {/* 오른쪽: 운영중, 교환권여부 */}
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'space-around',
            alignItems: 'center'
          }}
        >
          <Image
            source={iconOpen}
            style={{ width: iconSize, height: iconSize }}
          />
          <Image
            source={iconRewards}
            style={{ width: iconSize, height: iconSize }}
          />
        </View>
      </TouchableOpacity>
    );
  }
}
