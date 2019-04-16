import React, { Component } from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  View,
  Text
} from 'react-native';
import axios from '../modules/axios-connector';

export default class AuthLoadingScreen extends React.Component {
  constructor() {
    super();
    this._bootstrapAsync();
  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    const userToken = await AsyncStorage.getItem('ggugCustomerToken');
    if (!userToken) {
      // 토큰이 없으면 로그인 화면으로
      this.props.navigation.navigate('Auth');
    } else {
      // 토큰이 있으면 서버에 유효성 검사 요청
      axios
        .get('/tests')
        .then(() => {
          // 유효하면 로그인 성공
          this.props.navigation.navigate('Main');
        })
        .catch(() => {
          // 유효하지 않으면 로그인 화면으로->로그인해 새토큰 받도록
          this.props.navigation.navigate('Auth');
        });
    }
  };

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
