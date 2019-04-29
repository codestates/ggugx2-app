import React from 'react';
import {
  Image,
  StyleSheet,
  View,
  AsyncStorage,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  Text
} from 'react-native';
import { Button, Input, ThemeProvider } from 'react-native-elements';
import axios from '../modules/axios-connector';
// import console = require('console');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    width: '100%',
    backgroundColor: '#fff',
    padding: 30,
    // alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center'
  },
  welcomeImage: {
    width: 60,
    height: 60
  },
  buttonKakao: {
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
      padding: 10
    },
    containerStyle: {
      alignSelf: 'center',
      width: '100%',
      margin: 5,
      borderWidth: 0
    },
    placeholderTextColor: '#999'
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

        await AsyncStorage.setItem(
          'ggugCustomerToken',
          JSON.stringify({ userToken, customerID })
        );
        this.props.navigation.navigate('AuthLoading', { customerID });
      })
      .catch(error => {
        alert(`실패! ${error}`);
      });
  };

  onPressSignup = () => {
    this.props.navigation.navigate('SignUp');
  };

  handleInputChange = (text, name) => {
    if (name === 'phone') {
      if (text.length === 3) {
        text += '-';
      } else if (text.length === 8) {
        text += '-';
      }
    }
    this.setState({
      [name]: text
    });
  };
  render() {
    const { onPressLogin, onPressSignup, handleInputChange } = this;
    return (
      <KeyboardAvoidingView style={styles.container} behavior={'padding'}>
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <ThemeProvider theme={theme}>
            <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
              <Image
                source={require('../assets/images/muziLogin.png')}
                style={styles.welcomeImage}
              />
              <Text
                style={{
                  fontSize: 50,
                  fontFamily: 'Gamja-Flower-Regular',
                  color: 'hsl(25, 85%, 50%)',
                  shadowColor: 'gray',
                  shadowOpacity: 1,
                  shadowRadius: 4,
                  shadowOffset: {
                    width: 2,
                    height: 2
                  }
                }}
              >
                꾹꾹이
              </Text>
            </View>

            <Input
              value={this.state.phone}
              placeholder={'전화번호: 010-1234-1234'}
              textContentType={'telephoneNumber'}
              keyboardType={'numeric'}
              onChangeText={e => {
                handleInputChange(e, 'phone');
              }}
              clearButtonMode={'while-editing'}
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
            <Button
              title={'가입'}
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
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    );
  }
}
