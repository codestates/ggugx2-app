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
      console.log('토큰없음. 로그인으로');
      this.props.navigation.navigate('Auth');
    } else {
      console.log('토큰있음 -> 유효성검사');
      const { userToken, customerID } = JSON.parse(AuthObject);
      console.log('AsyncStorage에 저장돼있는 토큰 : ', userToken);
      console.log('AsyncStorage에 저장돼있는 손님 ID : ', customerID);
      // 토큰이 있으면 서버에 유효성 검사 요청
      axios
        .get('/tests', {
          headers: { Authorization: `Bearer ${userToken}` }
        })
        .then(response => {
          // 유효하면 로그인 성공
          console.log('유효한 토큰. Main으로', response.data);
          // 헤더의 Authorization에 토큰을 항상 포함시키도록 함
          axios.defaults.headers.common[
            'Authorization'
          ] = `Bearer ${userToken}`;
          console.log(
            'AuthLoading] Main으로 넘길 customerID: ',
            customerID || 99
          );
          // 일단 params 넣긴했는데, switchNavagator는 스크린간 params 전달이 안된다.
          this.props.navigation.navigate('Main', { customerID });
        })
        .catch(error => {
          // 유효하지 않으면 로그인 화면으로->로그인해 새토큰 받도록
          console.log('유효하지 않은 토큰. 로그인으로', error.response.data);
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
