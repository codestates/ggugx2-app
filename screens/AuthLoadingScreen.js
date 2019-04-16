import React, { Component } from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  View,
  Text
} from 'react-native';

export default class AuthLoadingScreen extends React.Component {
  constructor() {
    super();
    this._bootstrapAsync();
  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    // TODO: 토큰을 갖고있는것 뿐만 아니라, 유효한 토큰인지 서버에 검사해야 하지 않나?
    // 만약 자동로그인으로 앱을 오래 켜놓는 사이 유효기간이 끝났고
    // 어떤 API요청을 날렸더니 fail이 오면(내용에 auth만료인걸 알수있게 응답이 오면 다시 로그인하라고 signin페이지로 넘겨주면되겠다)
    //
    const userToken = await AsyncStorage.getItem('ggugCustomerToken');

    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    this.props.navigation.navigate(userToken ? 'Main' : 'Auth');
  };

  // Render any loading content that you like here
  render() {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <ActivityIndicator />
        <StatusBar barStyle="default" />
        <Text> 인증 정보를 확인중입니다.</Text>
      </View>
    );
  }
}
