import React from 'react';
import { Image, StyleSheet, View, AsyncStorage } from 'react-native';
import { Button, Input, ThemeProvider } from 'react-native-elements';

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
  static navigationOptions = {
    header: null
  };
  onPressLogin = async () => {
    await AsyncStorage.setItem('userToken', 'abc');
    this.props.navigation.navigate('Main');
  };
  onPressSignup = () => {
    this.props.navigation.navigate('SignUp');
  };
  onPressKaKao = () => {
    alert('카카오 OAuth!');
  };
  render() {
    const { onPressLogin, onPressSignup, onPressKaKao } = this;
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
          />
          <Input placeholder={'비밀번호'} secureTextEntry={true} />
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
