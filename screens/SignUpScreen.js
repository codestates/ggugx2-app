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
  input: {
    width: '50%',
    height: 30,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'gray',
    margin: 2
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
      padding: 10
    },
    style: {
      // fontSize: 50
    }
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
    const { onPressLogin, onPressSignup, onPressKaKao } = this;
    return (
      <View style={styles.container}>
        <Image
          source={require('../assets/images/muziLogin.png')}
          style={styles.welcomeImage}
        />
        <ThemeProvider theme={theme}>
          <Input
            style={styles.input}
            label={'이름'}
            placeholder={'이름'}
            placeholderTextColor={'#333'}
            textContentType={'telephoneNumber'}
          />
          <Input
            style={styles.input}
            label={'전화번호'}
            placeholder={'전화번호'}
            placeholderTextColor={'#333'}
            textContentType={'telephoneNumber'}
          />
          <Input
            style={styles.input}
            label={'비밀번호'}
            placeholder={'비밀번호'}
            placeholderTextColor={'#333'}
            textContentType={'telephoneNumber'}
          />
          <Input
            style={styles.input}
            label={'비밀번호 확인'}
            placeholder={'비밀번호 확인'}
            placeholderTextColor={'#333'}
            textContentType={'telephoneNumber'}
          />
          <Button title={'가입'} onPress={onPressSignup} />
        </ThemeProvider>
      </View>
    );
  }
}
