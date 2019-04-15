import React, { Component } from 'react';
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

  render() {
    return (
      <ThemeProvider theme={theme}>
        {/* 최상위 View */}
        <View style={s.container}>
          <Text h3>{this.props.navigation.state.params}</Text>
          <View>
            <Text>쿠폰을 보내고 싶은 분의 핸드폰 번호를 입력해 검색하세요</Text>
            <Input
              placeholder={'전화번호'}
              textContentType={'telephoneNumber'}
              keyboardType={'numeric'}
            />
            <Button title={'찾기'} />
          </View>
        </View>
      </ThemeProvider>
    );
  }
}
