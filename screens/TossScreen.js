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
      borderWidth: 1
    }
  },
  Text: {
    style: {
      borderWidth: 1,
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
    backgroundColor: 'white',
    flexDirection: 'column'
    // paddingTop: 22
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
    this.setState({
      [name]: text
    });
  };

  onPressFind = async () => {
    this.setState({ remainStamps: null });
    const { phone } = this.state;
    const uri = '/customers/exist';
    console.log('입력받은 전화번호 : ', phone);
    try {
      const response = await axios.post(uri, { phone });
      console.log(`${uri} 성공`, response.data);
      const { id: to, name } = response.data;
      this.setState({
        to,
        name,
        error: false
      });
    } catch (error) {
      console.log(`${uri} 실패`, error);
      console.log('message: ', error.response.data);
      this.setState({
        name: null,
        error: true
      });
    }
  };

  onPressToss = async () => {
    const {
      storeID: store,
      customerID: from
    } = this.props.navigation.state.params;
    const { to, stamps } = this.state;
    const stampsNumber = Number(stamps);
    const uri = '/stamps/toss';
    console.log('토스 보내는 오브젝트', {
      store,
      from,
      to,
      stamps: stampsNumber
    });
    try {
      const response = await axios.post(uri, {
        store,
        from,
        to,
        stamps: stampsNumber
      });
      console.log(`${uri} 성공`, response.data);
      this.setState({
        remainStamps: response.data.stamps,
        name: null
      });
    } catch (error) {
      console.log(`${uri} 실패`, error);
      console.log('message: ', error.response.data);
    }
  };

  render() {
    const { handleInputChange, onPressFind, onPressToss } = this;
    const { name, to, error, stamps, remainStamps } = this.state;
    return (
      <ThemeProvider theme={theme}>
        {/* 최상위 View */}
        <View style={s.container}>
          <Text h3>{this.props.navigation.state.params.storeName}</Text>
          <Input
            placeholder={'010-1234-1234'}
            textContentType={'telephoneNumber'}
            keyboardType={'numeric'}
            onChangeText={e => {
              handleInputChange(e, 'phone');
            }}
          />
          <Button title={'찾기'} onPress={onPressFind} />
          <Text>스탬프를 보내고 싶은 분의 핸드폰 번호를 입력해 검색하세요</Text>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'center',
              alignContent: 'center'
            }}
          >
            {name && (
              <View
                style={{
                  width: '80%',
                  // height: 200,
                  backgroundColor: 'lightblue',
                  flexDirection: 'column',
                  flexWrap: 'nowrap',
                  alignItems: 'stretch',
                  justifyContent: 'center'
                }}
              >
                <Text style={{ fontSize: 23 }}>{name}님</Text>
                <View style={{ flexDirection: 'row' }}>
                  <Input
                    type={'text'}
                    containerStyle={{ width: 90, borderWidth: 1 }}
                    value={stamps}
                    onChangeText={e => {
                      handleInputChange(e, 'stamps');
                    }}
                  />
                  <Text h4>개</Text>
                  <Button
                    title={'+'}
                    containerStyle={{ borderWidth: 1 }}
                    onPress={() => {
                      this.setState(state => {
                        const stampsNumber = Number(state.stamps) + 1;
                        const stamps = '' + stampsNumber;
                        return { stamps };
                      });
                    }}
                  />
                  <Button
                    title={'-'}
                    containerStyle={{ borderWidth: 1 }}
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
                <Button title={'토스하기'} onPress={onPressToss} />
              </View>
            )}
            {error && (
              <View style={{ width: '80%', backgroundColor: 'crimson' }}>
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
              <View style={{ width: '80%', backgroundColor: 'yellowgreen' }}>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: 'bold',
                    color: 'white',
                    textAlign: 'center'
                  }}
                >
                  토스 성공! 남은 스탬프 수: {remainStamps}
                </Text>
              </View>
            )}
          </View>
        </View>
      </ThemeProvider>
    );
  }
}
