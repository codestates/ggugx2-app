import React, { Component } from 'react';
import { View } from 'react-native';
import { Text, Input, Button, ThemeProvider } from 'react-native-elements';
import MenuEntry from '../Molecules/MenuEntry';

export default class MenusDisplay extends Component {
  render() {
    // Menus 테이블에서, SELECT NAME, PRICE FROM MENUS WHERE STORE_ID = ?;
    const menus = [
      {
        NAME: '아메리카노',
        PRICE: 4000
      },
      {
        NAME: '카페라뗴',
        PRICE: 4500
      },
      {
        NAME: '민트초코프라푸치노',
        PRICE: 5000
      }
    ];
    return (
      <View style={{ borderWidth: 1 }}>
        <Text>메뉴 정보 보여주는 Molecule</Text>
        {menus.map((menu, i) => (
          <MenuEntry menu={menu} key={i} />
        ))}
      </View>
    );
  }
}
