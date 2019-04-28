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
    width: '100%',
    backgroundColor: '#fff',
    paddingTop: 0,
    padding: 20,
    justifyContent: 'center',
    alignContent: 'center'
  },
  welcomeImage: {
    width: 60,
    height: 60
  },
  button: {
    backgroundColor: 'rgb(255, 205, 55)'
  }
});

const theme = {
  Button: {
    buttonStyle: {
      height: 60,
      margin: 5
    },
    titleStyle: {
      color: '#333',
      fontSize: 24,
      fontWeight: 'bold'
    }
  },
  Input: {
    inputContinerStyle: {
      padding: 20
    },
    containerStyle: {
      margin: 5,
      borderWidth: 0,
      alignSelf: 'center'
    },
    placeholderTextColor: '#666'
  }
};
// TODO: 입력 validation, ..
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
    if (name === 'phone') {
      if (text.length === 3) {
        console.log('asdfasfs', text);
        text += '-';
      } else if (text.length === 8) {
        console.log('asdfasfs', text);
        text += '-';
      }
    }
    this.setState({
      [name]: text
    });
  };
  onPressSignup = () => {
    const { phone, username, password, passwordConfirm } = this.state;
    const { navigate } = this.props.navigation;
    if (password !== passwordConfirm) {
      alert('패스워드가 일치하지 않습니다');
      return;
    }
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
              source={require('../assets/images/muzi_twinkle.png')}
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
                value={this.state.phone}
                placeholder={'010-1234-1234'}
                textContentType={'telephoneNumber'}
                keyboardType={'numeric'}
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
              <Button
                title={'가입하기'}
                onPress={onPressSignup}
                buttonStyle={{
                  backgroundColor: 'yellowgreen'
                }}
                containerStyle={{
                  shadowColor: 'gray',
                  shadowOpacity: 1,
                  shadowRadius: 4,
                  shadowOffset: {
                    width: 2,
                    height: 2
                  }
                }}
              />
            </ThemeProvider>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    );
  }
}
