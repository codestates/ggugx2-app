import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Text, Button, Input, ThemeProvider } from 'react-native-elements';
import axios from '../modules/axios-connector';

// import console = require('console');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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

export default class SignUpScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      phone: null,
      username: null,
      password: null
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
      .post('/users/signup', {
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
      <View style={styles.container}>
        <Image
          source={require('../assets/images/muziLogin.png')}
          style={styles.welcomeImage}
        />
        <ThemeProvider theme={theme}>
          <Input
            placeholder={'이름'}
            textContentType={'name'}
            onChangeText={e => {
              handleInputChange(e, 'username');
            }}
          />
          <Input
            placeholder={'전화번호'}
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
          <Button title={'가입'} onPress={onPressSignup} />
        </ThemeProvider>
      </View>
    );
  }
}
