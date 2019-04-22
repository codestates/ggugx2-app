import React from 'react';
import {
  Image,
  StyleSheet,
  View,
  AsyncStorage,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback
} from 'react-native';
import { Button, Input, ThemeProvider } from 'react-native-elements';
import axios from '../modules/axios-connector';
// import console = require('console');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 30,
    // alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'space-between'
  },
  welcomeImage: {
    width: 50,
    height: 50
  },
  buttonKakao: {
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
      padding: 10
    },
    containerStyle: {
      margin: 5
    },
    placeholderTextColor: '#999',
    style: {
      width: '50%',
      height: 30,
      borderRadius: 4,
      borderWidth: 1,
      borderColor: 'gray'
    }
  }
};

export default class SignInScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      phone: null,
      password: null
    };
  }
  static navigationOptions = {
    header: null
  };
  onPressLogin = () => {
    const { phone, password } = this.state;
    // TODO: 패스워드를 평문 전송하고있음. 암호화해서 서버에 요청 날리면 좋겠다.
    axios
      .post('/customers/signin', {
        phone,
        password
      })
      .then(async response => {
        const { token: userToken, customerID } = response.data;
        console.log('로그인 성공 - token : ', userToken);
        await AsyncStorage.setItem(
          'ggugCustomerToken',
          JSON.stringify({ userToken, customerID })
        );
        this.props.navigation.navigate('AuthLoading', { customerID });
      })
      .catch(error => {
        console.log('로그인 실패 : ', error.message);
        alert(`실패! ${error}`);
      });
  };
  onPressSignup = () => {
    this.props.navigation.navigate('SignUp');
  };
  onPressKaKao = () => {
    alert('카카오 OAuth!');
  };
  handleInputChange = (text, name) => {
    this.setState({
      [name]: text
    });
  };
  render() {
    const {
      onPressLogin,
      onPressSignup,
      onPressKaKao,
      handleInputChange
    } = this;
    return (
      <KeyboardAvoidingView style={styles.container} behavior={'padding'}>
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View>
            <Image
              source={require('../assets/images/muziLogin.png')}
              style={styles.welcomeImage}
            />
            <ThemeProvider theme={theme}>
              <Input
                placeholder={'010-1234-1234'}
                textContentType={'telephoneNumber'}
                keyboardType={'numeric'}
                onChangeText={e => {
                  handleInputChange(e, 'phone');
                }}
              />
              <Input
                placeholder={'비밀번호'}
                secureTextEntry={true}
                onChangeText={e => {
                  handleInputChange(e, 'password');
                }}
              />
              <Button
                title={'로그인'}
                onPress={onPressLogin}
                buttonStyle={styles.buttonKakao}
              />
              <Button title={'가입'} onPress={onPressSignup} />
              <Button
                title={'카카오톡으로 로그인'}
                onPress={onPressKaKao}
                type={'outline'}
              />
            </ThemeProvider>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    );
  }
}
