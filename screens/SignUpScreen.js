import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Button, Input, ThemeProvider } from 'react-native-elements';

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
  static navigationOptions = {
    title: '회원가입'
  };
  onPressSignup = () => {
    alert('가입!');
  };
  render() {
    const { onPressSignup } = this;
    return (
      <View style={styles.container}>
        <Image
          source={require('../assets/images/muziLogin.png')}
          style={styles.welcomeImage}
        />
        <ThemeProvider theme={theme}>
          <Input
            // label={'이름'}
            placeholder={'이름'}
            textContentType={'telephoneNumber'}
          />
          <Input
            // label={'전화번호'}
            placeholder={'전화번호'}
            textContentType={'telephoneNumber'}
          />
          <Input
            // label={'비밀번호'}
            placeholder={'비밀번호'}
            textContentType={'telephoneNumber'}
          />
          <Input
            // label={'비밀번호 확인'}
            placeholder={'비밀번호 확인'}
            textContentType={'telephoneNumber'}
          />
          <Button title={'가입'} onPress={onPressSignup} />
        </ThemeProvider>
      </View>
    );
  }
}
