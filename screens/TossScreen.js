import React, { Component, useState } from 'react';
import {
  AsyncStorage,
  View,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableHighlight,
  TouchableOpacity,
  ScrollView,
  StyleSheet
} from 'react-native';
import {
  Button,
  ListItem,
  Text,
  ThemeProvider,
  SearchBar,
  Header,
  Input
} from 'react-native-elements';
import axios from '../modules/axios-connector';

const theme = {
  View: {
    style: {
      borderWidth: 0
    }
  },
  Text: {
    style: {
      borderWidth: 0,
      borderColor: 'blue'
    }
  },
  Button: {
    // type: 'clear',
    style: { width: 74 },
    titleStyle: {
      color: 'black'
    }
  },
  Header: {
    // centerContainerStyle: { flex: 4 },
    // leftContainerStyle: { flex: 1 },
    // rightContainerStyle: { flex: 1 },
    containerStyle: {
      backgroundColor: 'white'
    }
  },
  Input: {
    inputContinerStyle: {
      padding: 20
    },
    containerStyle: {
      margin: 5
    },
    placeholderTextColor: '#999'
  }
};

const s = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    // backgroundColor: 'white',
    flexDirection: 'column'
  }
});

export default class TossScreen extends Component {
  static navigationOptions = {
    title: '토스하기'
  };

  constructor(props) {
    super(props);
    this.state = {
      phone: null,
      name: null,
      to: null,
      stamps: '1',
      error: false,
      remainStamps: null
    };
  }

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

  onPressFind = async () => {
    this.setState({ remainStamps: null, to: null });
    const { phone } = this.state;
    if (phone === null || phone.length < 11) {
      // FIXME: 번호형식이 맞는지 validation 필요
      alert('번호를 입력해주세요');
      return;
    }
    const uri = '/customers/exist';

    try {
      const response = await axios.post(uri, { phone });

      const { id: to, name } = response.data;
      this.setState({
        to,
        name,
        error: false
      });
    } catch (error) {
      this.setState({
        name: null,
        error: true
      });
    }
    Keyboard.dismiss();
  };

  onPressToss = async () => {
    const {
      storeID: store,
      customerID: from
    } = this.props.navigation.state.params;
    const { to, stamps } = this.state;
    const stampsNumber = Number(stamps);

    const uri = '/stamps/toss';

    try {
      const response = await axios.post(uri, {
        store,
        from,
        to,
        stamps: stampsNumber
      });

      this.setState({
        remainStamps: response.data.stamps,
        name: null
      });
    } catch (error) {}
  };

  render() {
    const { handleInputChange, onPressFind, onPressToss } = this;
    const { name, to, error, stamps, remainStamps } = this.state;
    return (
      <ThemeProvider theme={theme}>
        {/* 최상위 View */}
        <View style={s.container}>
          <Text
            style={{
              textAlign: 'center',
              fontSize: 30,
              fontWeight: 'bold',
              // paddingTop: 6
              marginVertical: 10,
              color: '#222'
            }}
          >
            {this.props.navigation.state.params.storeName}
          </Text>
          <Text
            style={{
              color: '#333'
            }}
          >
            내가 모은 스탬프를 친구에게 보내보세요!
          </Text>
          <Input
            value={this.state.phone}
            placeholder={'010-1234-1234'}
            textContentType={'telephoneNumber'}
            keyboardType={'numeric'}
            onChangeText={e => {
              handleInputChange(e, 'phone');
            }}
            inputStyle={{ padding: 5 }}
            clearButtonMode={'while-editing'}
          />
          <Button
            title={'찾기'}
            onPress={onPressFind}
            buttonStyle={{
              borderRadius: 100,
              height: 50,
              width: 200,
              backgroundColor: 'rgb(255, 205, 55)'
            }}
            containerStyle={{ alignSelf: 'center', width: 200, margin: 10 }}
            titleStyle={{ color: '#333', fontWeight: 'bold', fontSize: 24 }}
          />
          <Text
            style={{
              textAlign: 'center',
              color: '#555'
            }}
          >
            꾹꾹이 앱을 사용하지 않아도{'\n'}스탬프를 전달받을 수 있습니다!
            {'\n'}
            (교환권으로 교환하시려면 앱을 설치해주세요)
          </Text>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'center',
              alignContent: 'center'
            }}
          >
            {to !== null && remainStamps === null && (
              <View
                style={{
                  width: '80%',
                  // height: 170,
                  backgroundColor: '#fbf5f5',
                  borderWidth: 1,
                  borderColor: 'gray',
                  borderRadius: 10,
                  flexDirection: 'column',
                  flexWrap: 'nowrap',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 15,
                  margin: 10
                }}
              >
                <Text
                  style={{
                    fontSize: 23,
                    fontWeight: 'bold',
                    color: 'hsl(15, 70%, 60%)'
                  }}
                >
                  {name ? `${name}님에게` : '꾹꾹이 앱을 사용하실 분에게'}
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginVertical: 20
                  }}
                >
                  <Input
                    type={'text'}
                    containerStyle={{
                      width: 90,
                      borderWidth: 0,
                      padding: 0,
                      margin: 0
                    }}
                    inputStyle={{
                      fontSize: 30,
                      fontWeight: 'bold',
                      color: '#e34235',
                      textAlign: 'right',
                      paddingRight: 10
                    }}
                    keyboardType={'numeric'}
                    value={stamps}
                    onChangeText={e => {
                      handleInputChange(e, 'stamps');
                    }}
                  />
                  <Text
                    style={{
                      fontSize: 24,
                      marginRight: 10,
                      color: '#333'
                    }}
                  >
                    개
                  </Text>
                  <Button
                    title={'▲'}
                    containerStyle={{
                      borderWidth: 0,
                      width: 50,
                      marginHorizontal: 5
                    }}
                    buttonStyle={{
                      width: 50,
                      backgroundColor: 'rgb(255, 205, 55)',
                      borderWidth: 0,
                      borderRadius: 10
                    }}
                    titleStyle={{
                      fontSize: 20,
                      fontWeight: 'bold',
                      color: '#333'
                    }}
                    onPress={() => {
                      this.setState(state => {
                        const stampsNumber = Number(state.stamps) + 1;
                        const stamps = '' + stampsNumber;
                        return { stamps };
                      });
                    }}
                  />
                  <Button
                    title={'▼'}
                    containerStyle={{
                      borderWidth: 0,
                      width: 50,
                      marginHorizontal: 5
                    }}
                    buttonStyle={{
                      width: 50,
                      backgroundColor: 'rgb(255, 205, 55)',
                      borderWidth: 0,
                      borderRadius: 10
                    }}
                    titleStyle={{
                      fontSize: 20,
                      fontWeight: 'bold',
                      color: '#333'
                    }}
                    onPress={() => {
                      this.setState(state => {
                        const stampsNumber = Number(state.stamps);
                        if (stampsNumber > 1) {
                          const stamps = '' + (stampsNumber - 1);
                          return { stamps };
                        }
                      });
                    }}
                  />
                </View>
                <Button
                  title={'토스하기'}
                  onPress={onPressToss}
                  containerStyle={{
                    borderWidth: 0,
                    width: 170,
                    height: 50,
                    marginHorizontal: 5
                  }}
                  buttonStyle={{
                    width: 170,
                    height: 50,
                    backgroundColor: 'hsl(19, 67%, 55%)',
                    borderWidth: 0,
                    borderRadius: 100
                  }}
                  titleStyle={{
                    fontSize: 24,
                    fontWeight: 'bold',
                    color: 'hsl(19, 90%, 95%)'
                  }}
                />
              </View>
            )}
            {error && (
              <View
                style={{
                  width: '80%',
                  backgroundColor: 'crimson',
                  padding: 10,
                  borderRadius: 5,
                  margin: 10
                }}
              >
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: 'bold',
                    color: 'white',
                    textAlign: 'center'
                  }}
                >
                  등록되지 않은 사용자입니다!
                </Text>
              </View>
            )}
            {remainStamps !== null && (
              <View
                style={{
                  width: '80%',
                  backgroundColor: 'yellowgreen',
                  padding: 20,
                  borderRadius: 5,
                  margin: 10
                }}
              >
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: 'bold',
                    color: 'white',
                    textAlign: 'center'
                  }}
                >
                  토스했습니다!{'\n'}
                </Text>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: 'bold',
                    color: 'white',
                    textAlign: 'center'
                  }}
                >
                  남은 스탬프는
                  <Text
                    style={{
                      fontSize: 25,
                      fontWeight: 'bold',
                      color: 'hsl(10, 80%, 50%)',
                      textAlign: 'center'
                    }}
                  >
                    {' '}
                    {remainStamps}
                  </Text>
                  개 입니다
                </Text>
              </View>
            )}
          </View>
        </View>
      </ThemeProvider>
    );
  }
}
