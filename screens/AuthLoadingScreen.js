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
    // AsyncStorage.clear();
  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    const AuthObject = await AsyncStorage.getItem('ggugCustomerToken');
    if (!AuthObject) {
      // 토큰이 없으면 로그인 화면으로

      this.props.navigation.navigate('Auth');
    } else {
      const { userToken, customerID } = JSON.parse(AuthObject);

      // 토큰이 있으면 서버에 유효성 검사 요청
      axios
        .get('/tests', {
          headers: { Authorization: `Bearer ${userToken}` }
        })
        .then(response => {
          // 유효하면 로그인 성공

          // 헤더의 Authorization에 토큰을 항상 포함시키도록 함
          axios.defaults.headers.common[
            'Authorization'
          ] = `Bearer ${userToken}`;

          // 일단 params 넣긴했는데, switchNavagator는 스크린간 params 전달이 안된다.
          this.props.navigation.navigate('Main', { customerID });
        })
        .catch(error => {
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
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <ActivityIndicator size={'large'} color={'gray'} />
        <StatusBar barStyle="default" />
        <Text style={{ margin: 10 }}> 인증 정보를 확인중입니다.</Text>
      </View>
    );
  }
}
