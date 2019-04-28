import React, { Component } from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Text } from 'react-native-elements';
import { Avatar } from 'react-native-elements';

const s = StyleSheet.create({
  containerTouchable: {
    height: 100,
    borderBottomWidth: 1,
    borderBottomColor: '#aaa',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    paddingVertical: 2
  },
  storeImageView: {
    flex: 0,
    width: 100,
    justifyContent: 'center',
    alignItems: 'center'
  },
  storeInfoTextsView: {
    flex: 4,
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  iconsView: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center'
  }
});

export default class SearchResultEntry extends Component {
  render() {
    const {
      storeName,
      distance,
      stamps,
      isOpen,
      haveRewards,
      img,
      menuFound
    } = this.props.itemObject;
    const { onPress } = this.props;
    const imgPlaceholder = img
      ? { uri: img }
      : require('../../assets/images/muzi_placeholder.jpg');
    const iconSize = 40;
    let distanceWithUnit =
      distance > 1000 ? (distance / 1000).toFixed(1) + 'km' : distance + 'm';
    return (
      <TouchableOpacity style={s.containerTouchable} onPress={onPress}>
        {/* 왼쪽: 매장사진 */}
        <View style={s.storeImageView}>
          <Avatar size={90} rounded source={imgPlaceholder} />
        </View>
        {/* 중간: 매장명, 거리, 스탬프수 */}
        <View style={s.storeInfoTextsView}>
          <Text
            style={{ fontSize: 20, fontWeight: 'bold', height: 30 }}
            numberOfLines={1}
          >
            {storeName}
          </Text>
          <Text style={{ fontSize: 14, height: 20 }}>
            거리 / {distanceWithUnit}
          </Text>
          <Text style={{ fontSize: 14, height: 20 }}>
            적립한 스탬프 수 / {stamps}개
          </Text>
          <Text style={{ fontSize: 14, height: 20 }}>
            {menuFound.name} {menuFound.price}원
          </Text>
        </View>
        {/* 오른쪽: 운영중, 교환권여부 */}
        <View style={s.iconsView}>
          {/* <Image
            source={iconOpen}
            style={{ width: iconSize, height: iconSize }}
          /> */}
          <View>
            {isOpen ? (
              <Text
                style={{
                  width: iconSize,
                  borderWidth: 2,
                  borderRadius: 4,
                  borderColor: 'hsl(100, 60%, 60%)',
                  fontSize: 12,
                  fontWeight: 'bold',
                  textAlign: 'center',
                  color: 'hsl(100, 70%, 30%)',
                  paddingVertical: 3
                }}
              >
                영업중
              </Text>
            ) : (
              <Text
                style={{
                  width: iconSize,
                  borderWidth: 2,
                  borderRadius: 4,
                  borderColor: 'hsl(100, 20%, 70%)',
                  padding: 1,
                  fontSize: 12,
                  fontWeight: 'bold',
                  textAlign: 'center',
                  color: 'hsl(100, 35%, 60%)',
                  paddingVertical: 3
                }}
              >
                휴무
              </Text>
            )}
          </View>
          <View>
            {haveRewards ? (
              <Text
                style={{
                  width: iconSize,
                  borderWidth: 2,
                  borderRadius: 4,
                  borderColor: 'rgb(223, 58, 47)',
                  fontSize: 12,
                  fontWeight: 'bold',
                  textAlign: 'center',
                  color: 'rgb(223, 58, 47)',
                  paddingVertical: 3
                }}
              >
                교환권
              </Text>
            ) : (
              <Text
                style={{
                  width: iconSize,
                  borderWidth: 2,
                  borderRadius: 4,
                  borderColor: 'hsl(4, 20%, 80%)',
                  padding: 1,
                  fontSize: 12,
                  fontWeight: 'bold',
                  textAlign: 'center',
                  color: 'hsl(4, 20%, 60%)',
                  paddingVertical: 3
                }}
              >
                없음
              </Text>
            )}
          </View>
          {/* <Image
            source={iconRewards}
            style={{ width: iconSize, height: iconSize }}
          /> */}
        </View>
      </TouchableOpacity>
    );
  }
}
