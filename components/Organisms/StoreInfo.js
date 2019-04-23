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
          <View style={{ flexDirection: 'row' }}>
            <Text style={s.title}>주소</Text>
            <Text style={{ fontSize: 29 }}>{address}</Text>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <Text style={s.title}>영업시간</Text>
            <View>
              <View
                style={{
                  flexDirection: 'row',
                  borderWidth: 0,
                  alignItems: 'baseline'
                }}
              >
                <Image
                  source={iconOpen}
                  style={{ width: 30, height: 30, margin: 4 }}
                />
                <Text style={{ fontSize: 28 }}>
                  {openhour ? openhour.slice(0, -3) : 'error'} ~{' '}
                  {closehour ? closehour.slice(0, -3) : 'error'}
                </Text>
              </View>
              <Text style={{ fontSize: 24 }}>{dayoff}요일 휴무</Text>
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
        <MenusDisplay menuList={menuList} />
      </View>
    );
  }
}
