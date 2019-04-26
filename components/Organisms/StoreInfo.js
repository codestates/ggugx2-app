import React, { Component } from 'react';
import {
  View,
  Linking,
  TouchableOpacity,
  Image,
  StyleSheet
} from 'react-native';
import { Text, ThemeProvider } from 'react-native-elements';
import MenusDisplay from '../Molecules/MenusDisplay';

const theme = {
  Text: {
    style: {
      height: 40
    }
  }
};

const s = StyleSheet.create({
  title: {
    width: 80,
    fontSize: 18,
    paddingTop: 8,
    fontWeight: 'bold'
  },
  hoursRow: {
    flexDirection: 'row',
    borderWidth: 0,
    alignItems: 'baseline'
  },
  content: {
    flex: 1,
    paddingTop: 4
  }
});

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
    const iconOpen = require('../../assets/images/icon-open.png');
    return (
      <View style={{ borderWidth: 0, padding: 10 }}>
        <ThemeProvider theme={theme}>
          <View
            style={{
              flexDirection: 'row'
            }}
          >
            <Text style={s.title}>주소</Text>
            <View style={s.content}>
              <Text
                style={{ fontSize: 20, borderWidth: 0, height: 80 }}
                numberOfLines={3}
              >
                {address}
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <Text style={s.title}>영업시간</Text>
            <View style={s.content}>
              <View style={s.hoursRow}>
                <Text style={{ fontSize: 23 }}>
                  {openhour ? openhour.slice(0, -3) : 'error'} ~{' '}
                  {closehour ? closehour.slice(0, -3) : 'error'}
                </Text>
              </View>
              <Text style={{ fontSize: 22 }}>
                {dayoff ? `${dayoff}요일 휴무` : '연중무휴'}
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <Text style={s.title}>전화번호</Text>
            <TouchableOpacity
              onPress={() => {
                Linking.openURL(`tel:${contact}`);
              }}
              style={{ borderWidth: 0, width: 200 }}
            >
              <Text h4 style={{ color: 'darkblue' }}>
                {contact}
              </Text>
            </TouchableOpacity>
          </View>
        </ThemeProvider>
        <Text style={s.title}>메뉴</Text>
        <MenusDisplay menuList={menuList} />
      </View>
    );
  }
}
