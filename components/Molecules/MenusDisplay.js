import React, { Component } from 'react';
import { View } from 'react-native';
import { Text, Input, Button, ThemeProvider } from 'react-native-elements';
import MenuEntry from './TextTextEntry';

export default class MenusDisplay extends Component {
  render() {
    const { menuList } = this.props;
    return (
      <View style={{ borderWidth: 0 }}>
        {menuList.map((menu, i) => (
          <MenuEntry
            list={{ LEFT: menu.name, RIGHT: menu.price }}
            suffix={'원'}
            key={i}
            styleLeft={{ fontSize: 22 }}
            styleRight={{ fontSize: 22 }}
          />
        ))}
      </View>
    );
  }
}
