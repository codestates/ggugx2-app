import React, { Component } from 'react';
import {
  View,
  Modal,
  ScrollView,
  AsyncStorage,
  ActivityIndicator
} from 'react-native';
import {
  Button,
  Text,
  ThemeProvider,
  Header,
  Overlay
} from 'react-native-elements';
import StoresEntry from '../components/Molecules/TextTextEntry';
import axios from '../modules/axios-connector';
// import socket from '../modules/socket-connector';
import io from 'socket.io-client';

// GPS 현위치를 서버에 보내 (가까운 순서로) storeID, storeName, distance를 응답해주는 API 필요
// -> 받아온 배열의 0번 인덱스가 가장 가까운 매장이므로, nearbyStoresList[0].storeID를 자동선택된 매장 ID로 주면됨.
// const nearbyStoresList = [
//   {
//     storeID: 0,
//     storeName: '스벅 성수',
//     distance: '234'
//   }
// ];

// 받아온 가까운 매장들 리스트에서 가장 가까운 매장의 storeID를 현 화면의 매장으로 자동선택
// const currentStoreID = nearbyStoresList[0].storeID;

// currentStoreID와 customerID로 요청보내서 스탬프와 교환권 수를 응답해주는 API 필요
// const stampsObject = {
//   stamps: 3,
//   rewards: 1
// };

export default class CollectionScreen extends Component {
  static navigationOptions = {
    header: null
  };
  constructor(props) {
    super(props);
    this.state = {
      customerID: null,
      storeID: 0,
      modalVisible: false,
      stampsObject: {},
      nearbyStoresList: []
    };
    this.isComplete = false;
    this.getCustomerID();
    this.getStampsRewardsCounts();
    this.getNearbyStoresList();
    this.socket = io('http://localhost:3000');
    this.socket.on('stamp add complete', msg => {
      if (msg && msg.confirm) {
        console.log('stamp add complete :: ', msg);
        this.setState({ modalVisible: true, isComplete: true });
      }
    });
  }

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

  emitRegister = id => {
    this.socket.emit('register', { id: id });
  };

  emitRequestStamp = storeID => {
    this.socket.emit('stamp add from user', { store: storeID });
  };

  getCustomerID = async () => {
    // customerID를 읽어온다 (switchNavigator는 params로 전달 불가)
    const { customerID } = JSON.parse(
      await AsyncStorage.getItem('ggugCustomerToken')
    );

    console.log(
      'TCL: CollectionScreen -> getCustomerID -> customerID',
      customerID
    );
    this.setState({ customerID });

    this.emitRegister(`CSTM:${customerID}:`);
  };

  getStampsRewardsCounts = () => {
    axios.defaults.baseURL = 'http://localhost:3030';
    axios
      .get('/customers-get-stamps-rewards-counts')
      .then(response => {
        console.log('getStampsRewardsCounts 성공');
        this.setState({ stampsObject: response.data });
      })
      .catch(error => {
        console.log('getStampsRewardsCounts 실패', error);
      });
    axios.defaults.baseURL =
      'http://ec2-13-115-51-251.ap-northeast-1.compute.amazonaws.com:3000';
  };

  getNearbyStoresList = () => {
    axios.defaults.baseURL = 'http://localhost:3030';
    axios
      .get('/nearby-stores-list')
      .then(response => {
        console.log('nearby-stores-list 성공');
        this.setState({ nearbyStoresList: response.data });
      })
      .catch(error => {
        console.log('nearby-stores-list 실패', error);
      });
    axios.defaults.baseURL =
      'http://ec2-13-115-51-251.ap-northeast-1.compute.amazonaws.com:3000';
  };

  render() {
    const { theme, emitRequestStamp } = this;
    const {
      stampsObject,
      nearbyStoresList,
      customerID,
      storeID,
      isComplete
    } = this.state;
    console.log(
      'CollectionScreen] render() customerID : ',
      this.state.customerID
    );
    return (
      <ThemeProvider theme={theme}>
        <Header
          placement={'center'}
          centerComponent={{ text: '컴포즈 성수', style: { fontSize: 30 } }}
          backgroundColor={'white'}
        />
        {/* modal 창 */}
        {/* TODO: Modal 대신 elements의 Overlay 사용 고려해볼것 / 혹은 display:'none' 이용하는 컴포넌트 만들기 / 혹은 Portal로 만들기 */}
        <Overlay
          isVisible={this.state.modalVisible}
          width={'80%'}
          height={200}
          onBackdropPress={() => {
            isComplete &&
              this.setState({ modalVisible: false, isComplete: false });
          }}
        >
          {!isComplete ? (
            <View>
              <ActivityIndicator />
              <Text>사장님의 확인을 기다리는 중입니다.</Text>
            </View>
          ) : (
            <View>
              <Text>적립이 완료됐습니다</Text>
              <Button
                title={'닫기'}
                onPress={() => {
                  this.setState({ modalVisible: false, isComplete: false });
                }}
              />
            </View>
          )}
        </Overlay>
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
          {/* 쿠폰, 교환권 수 */}
          <View
            style={{
              flex: 2,
              backgroundColor: '#eee',
              padding: 10,
              justifyContent: 'center'
            }}
          >
            <Text>고객 ID: {this.state.customerID}</Text>
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
              <Text h4>쿠폰🐾: {stampsObject.stamps}개</Text>
              <Text h4>교환권💵: {stampsObject.rewards}개</Text>
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
              {nearbyStoresList.map((item, i) => (
                <StoresEntry
                  list={{
                    LEFT: item.storeName,
                    RIGHT: item.distance
                  }}
                  suffix={'m'}
                  key={i}
                  styleLeft={{ fontSize: 23 }}
                  styleRight={{ fontSize: 20 }}
                  onPress={() => {
                    this.setState({ storeID: item.storeId });
                  }}
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
                // this.setModalVisible(true);
                // this.waitForComplete();
                //
                emitRequestStamp(storeID);
                this.setState({ modalVisible: true });
              }}
            />
          </View>
        </View>
      </ThemeProvider>
    );
  }
}
