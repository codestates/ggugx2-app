import React from 'react';
import {
  Image,
  StyleSheet,
  View,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import { Text, Button, Input, ThemeProvider } from 'react-native-elements';
import axios from '../modules/axios-connector';

// import console = require('console');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 0,
    padding: 30,
    justifyContent: 'center',
    alignContent: 'space-between'
  },
  welcomeImage: {
    width: 50,
    height: 50
  },
  button: {
    backgroundColor: 'rgb(255, 205, 55)'
  }
});

const theme = {
  Button: {
    buttonStyle: {
      height: 60
    }
  },
  Input: {
    inputContinerStyle: {
      padding: 20
    },
    containerStyle: {
      margin: 5
    },
    placeholderTextColor: '#666'
  }
};
// TODO: 패스워드 확인 기능, 입력 validation, ..
export default class SignUpScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      phone: null,
      username: null,
      password: null,
      passwordConfirm: ''
    };
  }
  static navigationOptions = {
    title: '회원가입'
  };
  handleInputChange = (text, name) => {
    this.setState({
      [name]: text
    });
  };
  onPressSignup = () => {
    const { phone, username, password } = this.state;
    const { navigate } = this.props.navigation;
    axios
      .post('/customers/signup', {
        phone,
        username,
        password
      })
      .then(response => {
        alert('성공', response);
        navigate('AuthLoading');
      })
      .catch(error => {
        alert('실패', error);
      });
  };
  render() {
    const { onPressSignup, handleInputChange } = this;
    return (
      <KeyboardAvoidingView style={styles.container} behavior={'padding'}>
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View style={styles.container}>
            <Image
              source={require('../assets/images/muziLogin.png')}
              style={styles.welcomeImage}
            />
            <ThemeProvider theme={theme}>
              <Input
                placeholder={'홍길동'}
                textContentType={'name'}
                onChangeText={e => {
                  handleInputChange(e, 'username');
                }}
              />
              <Input
                placeholder={'010-1234-1234'}
                textContentType={'telephoneNumber'}
                onChangeText={e => {
                  handleInputChange(e, 'phone');
                }}
              />
              <Input
                placeholder={'비밀번호'}
                textContentType={'password'}
                onChangeText={e => {
                  handleInputChange(e, 'password');
                }}
                secureTextEntry={true}
              />
              <Input
                placeholder={'비밀번호 확인'}
                textContentType={'password'}
                onChangeText={e => {
                  handleInputChange(e, 'passwordConfirm');
                }}
                secureTextEntry={true}
              />
              <Button title={'가입하기'} onPress={onPressSignup} />
            </ThemeProvider>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    );
  }
}
