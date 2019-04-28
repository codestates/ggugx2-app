import React, { Component } from 'react';
import {
  View,
  ScrollView,
  AsyncStorage,
  ActivityIndicator,
  TouchableOpacity,
  Platform,
  Image
} from 'react-native';
import { Constants, Location, Permissions } from 'expo';
import {
  Button,
  Text,
  ThemeProvider,
  Header,
  Overlay
} from 'react-native-elements';
import { NavigationEvents } from 'react-navigation';

import StoresEntry from '../components/Molecules/TextTextEntry';
import StampsCountsDisplay from '../components/Molecules/StampsCountsDisplay';
import axios from '../modules/axios-connector';
import socket from '../modules/socket-connector';
// import io from 'socket.io-client';

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
    buttonStyle: {
      backgroundColor: 'rgb(255, 205, 55)',
      height: 120,
      width: 120,
      borderRadius: 100
    },
    titleStyle: { color: 'black', fontWeight: 'bold', fontSize: 25 },
    containerStyle: {
      borderWidth: 0,
      borderColor: 'gold'
    }
  }
};

export default class CollectionScreen extends Component {
  static navigationOptions = {
    header: null
  };
  constructor(props) {
    super(props);
    this.state = {
      customerID: null,
      storeID: null,
      storeName: '',
      modalVisible: false,
      stampsObject: {},
      nearbyStoresList: [],
      message: '사장님이 쿠폰을 확인중입니다...',
      errorMessage: null,
      location: null
    };
    this.isComplete = false;
    this.willFocus = false;
    this.getCustomerID();

    socket.on('stamp add complete', msg => {
      console.log('수신!', msg);
      if (msg && msg.customer === String(this.state.customerID)) {
        console.log('stamp add complete :: ', msg);
        this.setState({ modalVisible: true, isComplete: true });
        const { customerID, storeID } = this.state;
        this.getStampsRewardsCounts(customerID, storeID);
      }
    });
    socket.on('errors', msg => {
      console.log(`[socket.io error] ${msg.message}`);
    });
  }

  emitRegister = id => {
    socket.emit('register', { id, type: 'customer' });
  };

  emitRequestStamp = storeID => {
    socket.emit('stamp add from user', { store: storeID });
  };

  getCustomerID = async () => {
    // customerID를 읽어온다 (switchNavigator는 params로 전달 불가)
    try {
      const { customerID } = JSON.parse(
        await AsyncStorage.getItem('ggugCustomerToken')
      );

      console.log(
        'TCL: CollectionScreen -> getCustomerID -> customerID',
        customerID
      );
      this.setState({ customerID });

      // this.getStampsRewardsCounts(customerID, this.state.storeID);
      // FIXME: storeID도 가까운가게 리스트 받아온 다음 정해지는거라 이부분 달라져야함

      this.emitRegister(`${customerID}`);
    } catch (error) {
      console.log('getCustomerID 실패 :', error);
    }
  };

  getStampsRewardsCounts = async (customerID, storeID) => {
    // FIXME: 동기/비동기 처리 순서상 local에 axios.post 날리는 버그가 있어서 defaults 박아둠.
    // getNearbyStoresList 요청을 EC2에 날리게 되면 그때는 지워도 됨
    axios.defaults.baseURL =
      'http://ec2-13-115-51-251.ap-northeast-1.compute.amazonaws.com:3000';
    const uri = '/customers/get-stamps-rewards-counts';
    try {
      const response = await axios.post(uri, {
        customerID,
        storeID
      });

      console.log('getStampsRewardsCounts 성공', response.data);
      this.setState({ stampsObject: response.data });
      this.willFocus = true;
    } catch (error) {
      console.log('getStampsRewardsCounts 실패', error);
    }
  };

  getNearbyStoresList = async () => {
    const { longitude, latitude } = this.state.location.coords;
    const uri = '/stores/nearby';
    try {
      const response = await axios.post(uri, {
        longitude,
        lattitude: latitude
      });
      console.log('nearby-stores-list 성공', response.data);
      this.setState({ nearbyStoresList: response.data }, () => {
        const { storeName, storeID } = response.data[0];
        this.getStampsRewardsCounts(this.state.customerID, storeID);
        this.setState({
          storeName,
          storeID
        });
      });
    } catch (error) {
      console.log('nearby-stores-list 실패', error);
    }
  };

  componentWillMount() {
    if (Platform.OS === 'android' && !Constants.isDevice) {
      this.setState({
        errorMessage:
          'Oops, this will not work on Sketch in an Android emulator. Try it on your device!'
      });
    } else {
      this._getLocationAsync();
    }
  }

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: '위치 조회 권한을 설정해주세요'
      });
    }

    let location = await Location.getCurrentPositionAsync({});
    this.setState({ location }, this.getNearbyStoresList);
  };

  render() {
    const { emitRequestStamp } = this;
    const {
      stampsObject,
      nearbyStoresList,
      customerID,
      storeID,
      storeName,
      isComplete
    } = this.state;
    console.log(
      'CollectionScreen] render() customerID : ',
      this.state.customerID
    );
    const loadingImg = require('../assets/images/loadingfriends.gif');

    return (
      <ThemeProvider theme={theme}>
        <Header
          // placement={'center'}
          // centerComponent={{
          //   // text: storeName,
          //   style: { fontSize: 30 }
          // }}
          backgroundColor={'white'}
          containerStyle={{
            height: 0
          }}
        />
        <Text
          style={{
            color: 'gray',
            textAlign: 'center'
          }}
        >
          현재 계신 매장
        </Text>
        <Text
          style={{
            textAlign: 'center',
            fontSize: 30,
            fontWeight: 'bold',
            padding: 5
          }}
        >
          {storeName}
        </Text>

        <NavigationEvents
          onWillFocus={() => {
            console.log('CollectionScreen Will Focus');
            this.willFocus && this.getStampsRewardsCounts(customerID, storeID);
          }}
        />

        <Overlay
          isVisible={this.state.modalVisible}
          width={'80%'}
          height={200}
          onBackdropPress={() => {
            isComplete &&
              this.setState({ modalVisible: false, isComplete: false });
          }}
          overlayStyle={{
            borderWidth: 1,
            borderColor: 'lightgray',
            borderRadius: 10
          }}
        >
          {!isComplete ? (
            <View
              style={{
                height: '90%',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'space-around'
              }}
            >
              {/* <ActivityIndicator /> */}
              <Image source={loadingImg} style={{ width: 70, height: 70 }} />
              <Text style={{ fontSize: 22, textAlign: 'center' }}>
                사장님의 확인을 {'\n'}기다리는 중입니다!
              </Text>
            </View>
          ) : (
            <View
              style={{
                height: '90%',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'space-around'
              }}
            >
              <Text style={{ fontSize: 20 }}>적립이 완료됐습니다</Text>
              <Button
                containerStyle={{
                  width: 200,
                  height: 50,
                  borderRadius: 6,
                  borderWidth: 0
                  // marginTop: 30
                }}
                buttonStyle={{ width: 200, height: 50, borderRadius: 6 }}
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
            flexDirection: 'column'
            // paddingTop: 20
          }}
        >
          {/* 쿠폰, 교환권 수 */}
          <View
            style={{
              flex: 0,
              width: '90%',
              backgroundColor: '#fff',
              padding: 10,
              justifyContent: 'center',
              alignSelf: 'center'
            }}
          >
            {/* <Text>
              고객 ID: {this.state.customerID} {'         '}
              가게 ID: {this.state.storeID}
            </Text> */}
            <View
              style={{
                borderWidth: 1,
                borderRadius: 10,
                borderColor: 'gray',
                padding: 10,
                backgroundColor: 'hsl(15, 100%, 95%)',
                height: 108
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  marginLeft: 10
                }}
              >
                <Text h4>스탬프</Text>
                <StampsCountsDisplay
                  stampsObject={{ stamps: stampsObject.stamps, REQUIRED: 10 }}
                />
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  marginLeft: 10
                }}
              >
                <Text h4>교환권</Text>
                <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                  <Text
                    style={{
                      color: 'rgb(236, 66, 60)',
                      fontWeight: 'bold',
                      fontSize: 34,
                      marginRight: 7
                    }}
                  >
                    {stampsObject.rewards}
                  </Text>
                  <Text
                    style={{
                      fontSize: 26,
                      marginRight: 10
                    }}
                  >
                    개
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <View
            style={{
              flex: 1,
              width: '90%',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              padding: 0,
              borderWidth: 0,
              marginVertical: 10
            }}
          >
            <Button
              title={'적립하기'}
              onPress={() => {
                emitRequestStamp(storeID);
                this.setState({ modalVisible: true });
              }}
            />
          </View>
          {/* 근처 매장 리스트 */}
          <View
            style={{
              flex: 1,
              height: 150,
              width: '90%',
              margin: 10,
              // marginVertical: 50,
              backgroundColor: '#fff',
              padding: 10
            }}
          >
            <Text
              style={{
                fontWeight: 'bold',
                paddingLeft: 5,
                marginBottom: 5
              }}
            >
              지금 계신 매장이 아닌가요?
            </Text>
            <ScrollView
              style={{
                borderWidth: 1,
                borderRadius: 10,
                borderColor: 'gray',
                paddingHorizontal: 10,
                backgroundColor: 'hsl(15, 100%, 95%)'
              }}
            >
              {nearbyStoresList.map((item, i) => {
                let distanceWithUnit = item.distance;
                if (item.distance > 1000) {
                  distanceWithUnit = (item.distance / 1000).toFixed(1);
                }
                return (
                  <TouchableOpacity
                    onPress={() => {
                      const { storeID, storeName } = item;
                      const { customerID } = this.state;
                      this.setState({
                        storeID,
                        storeName
                      });
                      // TODO: getStampsRewardsCounts API 버그 : 매장이 있지만 메뉴는 등록하지 않은경우 서버 에러남
                      // 매장 등록하면 메뉴를 최소 1개 필수로 등록해야함
                      this.getStampsRewardsCounts(customerID, storeID);
                    }}
                    key={i}
                  >
                    <StoresEntry
                      list={{
                        LEFT: item.storeName,
                        RIGHT: distanceWithUnit
                      }}
                      suffix={item.distance > 1000 ? 'km' : 'm'}
                      styleLeft={{ fontSize: 20, padding: 3 }}
                      styleRight={{ fontSize: 17, padding: 3 }}
                    />
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
          {/* 적립 버튼 */}
          {/* {this.state.location !== null && (
            <Text>
              latitude: {this.state.location.coords.latitude} / longitude:{' '}
              {this.state.location.coords.longitude}
            </Text>
          )} */}
        </View>
      </ThemeProvider>
    );
  }
}
