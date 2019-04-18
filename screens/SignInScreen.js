import React from 'react';
import { Image, StyleSheet, View, AsyncStorage } from 'react-native';
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
    placeholderTextColor: '#666',
    style: {
      width: '50%',
      height: 30,
      borderRadius: 4,
      borderWidth: 1,
      borderColor: 'gray',
      margin: 2
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
      .post('/users/signin', {
        phone,
        password
      })
      .then(async response => {
        const token = response.data.token;
        console.log('로그인 성공 - token : ', token);
        await AsyncStorage.setItem('ggugCustomerToken', token);
        // TODO: 로그인 성공시 응답에 customerID를 포함시켜야 함.
        this.props.navigation.navigate('AuthLoading');
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
      <View style={styles.container}>
        <Image
          source={require('../assets/images/muziLogin.png')}
          style={styles.welcomeImage}
        />
        <ThemeProvider theme={theme}>
          <Input
            placeholder={'전화번호'}
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
    );
  }
}
