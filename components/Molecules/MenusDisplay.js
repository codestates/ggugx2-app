import React, { Component } from 'react';
import { View } from 'react-native';
import { Text, Input, Button, ThemeProvider } from 'react-native-elements';
import MenuEntry from './TextTextEntry';

export default class MenusDisplay extends Component {
  render() {
    const { menuList } = this.props;
    return (
      <View style={{ borderWidth: 1 }}>
        <Text>Molecules/MenusDisplay : 메뉴 정보 보여주는 Molecule</Text>
        {menuList.map((menu, i) => (
          <MenuEntry
            list={{ LEFT: menu.NAME, RIGHT: menu.PRICE }}
            suffix={'원'}
            key={i}
            styleLeft={{ fontSize: 25 }}
            styleRight={{ fontSize: 25 }}
          />
        ))}
      </View>
    );
  }
}
