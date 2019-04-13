import React, { Component } from 'react';
import { AsyncStorage, View, Modal } from 'react-native';
import { Button, ListItem, Text, ThemeProvider } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';

export default class CollectionScreen extends Component {
  static navigationOptions = {
    // header: null
    title: '컴포즈 성수',
    headerTitleStyle: {
      // fontWeight: 'bold',
      fontSize: 30
    }
  };
  theme = {
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
    }
  };
  state = {
    modalVisible: false,
    message: '사장님이 쿠폰을 확인중입니다...'
  };

  onPressLogout = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate('AuthLoading');
  };

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }
  waitForComplete = () => {
    this.setState({ message: '사장님이 쿠폰을 확인중입니다...' });
    setTimeout(() => {
      this.setState({ message: '쿠폰 꾹꾹이가 완료되었습니다!' });
    }, 2000);
    setTimeout(() => {
      this.setModalVisible(!this.state.modalVisible);
    }, 4000);
  };
  render() {
    const { onPressLogout, theme } = this;
    const list = [
      {
        storeName: '스벅 성수',
        distance: '234m'
      },
      {
        storeName: '스벅 성수',
        distance: '234m'
      },
      {
        storeName: '스벅 성수',
        distance: '234m'
      },
      {
        storeName: '스벅 성수',
        distance: '234m'
      },
      {
        storeName: '스벅 성수',
        distance: '234m'
      },
      {
        storeName: '스벅 성수',
        distance: '234m'
      },
      {
        storeName: '스벅 성수',
        distance: '234m'
      },
      {
        storeName: '스벅 성수',
        distance: '234m'
      },
      {
        storeName: '스벅 성수',
        distance: '234m'
      },
      {
        storeName: '스벅 성수',
        distance: '234m'
      },
      {
        storeName: '스벅 성수',
        distance: '234m'
      }
    ];

    return (
      <ThemeProvider theme={theme}>
        {/* modal 창 */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible}
        >
          <View
            style={{
              flex: 1,
              justifyContent: 'center'
            }}
          >
            <View
              style={{
                backgroundColor: 'lightgray',
                width: 300,
                height: 100,
                alignSelf: 'center'
              }}
            >
              <Text style={{ height: '60%' }}>{this.state.message}</Text>

              <Button
                title={'확인'}
                onPress={() => {
                  this.setModalVisible(!this.state.modalVisible);
                }}
              />
            </View>
          </View>
        </Modal>
        {/* 최상위 View */}
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            backgroundColor: 'white',
            flexDirection: 'column',
            paddingTop: 20
          }}
        >
          {/* 매장 이름 */}
          {/* 기기간 statusbar 높이 차이때문에 header title로 옮김 */}
          {/* <View
            style={{
              backgroundColor: '#ddd',
              borderWidth: 1,
              width: '100%',
              // height: 50,
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Text h2 style={{ fontWeight: 'bold' }}>
              컴포즈 성수
            </Text>
          </View> */}
          {/* 쿠폰, 교환권 수 */}
          <View
            style={{
              flex: 2,
              backgroundColor: '#eee',
              padding: 10,
              justifyContent: 'center'
            }}
          >
            <View
              style={{
                borderWidth: 1,
                width: 200,
                height: 100,
                backgroundColor: 'white',
                justifyContent: 'space-around',
                flexWrap: 'nowrap'
              }}
            >
              <Text h4>쿠폰🐾: 3개</Text>
              <Text h4>교환권💵: 1개</Text>
            </View>
          </View>
          {/* 근처 매장 리스트 */}
          <View
            style={{
              flex: 2,
              width: 300,
              margin: 10,
              backgroundColor: '#eee',
              padding: 10
            }}
          >
            <Text>지금 계신 매장이 아닌가요?</Text>
            <ScrollView style={{ borderWidth: 1 }}>
              {list.map((item, i) => (
                <ListItem
                  key={i}
                  title={`${item.storeName} ${item.distance}`}
                />
              ))}
            </ScrollView>
          </View>
          {/* 적립 버튼 */}
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              backgroundColor: '#eee',
              padding: 10
            }}
          >
            <Button
              title={'적립하기'}
              onPress={() => {
                this.setModalVisible(true);
                this.waitForComplete();
              }}
            />
            <Button title={'임시 로그아웃'} onPress={onPressLogout} />
          </View>
        </View>
      </ThemeProvider>
    );
  }
}
