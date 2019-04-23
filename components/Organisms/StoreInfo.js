import React, { Component } from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-elements';
import MenusDisplay from '../Molecules/MenusDisplay';

export default class StoreInfo extends Component {
  render() {
    const {
      address,
      openhour,
      closehour,
      dayoff,
      contact
    } = this.props.storeInfo;
    const { menuList } = this.props;
    return (
      <View style={{ borderWidth: 1 }}>
        <Text> Store Information (Organisms) </Text>
        <Text h4>{address}</Text>
        <Text h4>{openhour}</Text>
        <Text h4>{closehour}</Text>
        <Text h4>{dayoff}요일 휴무</Text>
        <Text h4>{contact}</Text>
        <MenusDisplay menuList={menuList} />
      </View>
    );
  }
}
