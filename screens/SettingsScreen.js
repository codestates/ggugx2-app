import React from 'react';
import { ExpoConfigView } from '@expo/samples';
import { ScrollView, AsyncStorage } from 'react-native';
import { Button } from 'react-native-elements';

export default class SettingsScreen extends React.Component {
  static navigationOptions = {
    title: 'app.json'
  };
  onPressLogout = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate('AuthLoading');
  };
  render() {
    /* Go ahead and delete ExpoConfigView and replace it with your
     * content, we just wanted to give you a quick view of your config */
    const { onPressLogout } = this;
    return (
      <ScrollView>
        <Button title={'임시 로그아웃'} onPress={onPressLogout} />
        <ExpoConfigView />
      </ScrollView>
    );
  }
}
