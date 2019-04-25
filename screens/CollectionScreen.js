import React, { Component } from 'react';
import {
  View,
  ScrollView,
  AsyncStorage,
  ActivityIndicator,
  TouchableOpacity,
  Platform
} from 'react-native';
import { Constants, Location, Permissions } from 'expo';
import {
  Button,
  Text,
  ThemeProvider,
  Header,
  Overlay
} from 'react-native-elements';
import StoresEntry from '../components/Molecules/TextTextEntry';
import axios from '../modules/axios-connector';
import socket from '../modules/socket-connector';
// import io from 'socket.io-client';

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
      storeID: 1,
      storeName: '가까운곳',
      modalVisible: false,
      stampsObject: {},
      nearbyStoresList: [],
      message: '사장님이 쿠폰을 확인중입니다...',
      errorMessage: null,
      location: null
    };
    this.isComplete = false;
    this.getCustomerID();
    this.getNearbyStoresList();

    socket.on('stamp add complete', msg => {
      if (msg && msg.confirm) {
        console.log('stamp add complete :: ', msg);
        this.setState({ modalVisible: true, isComplete: true });
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

      this.getStampsRewardsCounts(customerID, this.state.storeID);
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
    } catch (error) {
      console.log('getStampsRewardsCounts 실패', error.response);
    }
  };

  getNearbyStoresList = async () => {
    axios.defaults.baseURL = 'http://localhost:3030';
    const uri = '/nearby-stores-list';
    try {
      const response = await axios.get(uri);

      console.log('nearby-stores-list 성공');
      this.setState({ nearbyStoresList: response.data });
    } catch (error) {
      console.log('nearby-stores-list 실패', error);
    }

    axios.defaults.baseURL =
      'http://ec2-13-115-51-251.ap-northeast-1.compute.amazonaws.com:3000';
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
    this.setState({ location });
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

    return (
      <ThemeProvider theme={theme}>
        <Header
          placement={'center'}
          centerComponent={{
            text: storeName,
            style: { fontSize: 30 }
          }}
          backgroundColor={'white'}
        />

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
            <Text>
              고객 ID: {this.state.customerID} {'         '}
              가게 ID: {this.state.storeID}
            </Text>

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
                <TouchableOpacity
                  onPress={() => {
                    this.setState({
                      storeID: item.storeID,
                      storeName: item.storeName
                    });
                  }}
                  key={i}
                >
                  <StoresEntry
                    list={{
                      LEFT: item.storeName,
                      RIGHT: item.distance
                    }}
                    suffix={'m'}
                    styleLeft={{ fontSize: 23 }}
                    styleRight={{ fontSize: 20 }}
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
          {/* 적립 버튼 */}
          {this.state.location !== null && (
            <Text>
              latitude: {this.state.location.coords.latitude} / longitude:{' '}
              {this.state.location.coords.longitude}
            </Text>
          )}
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
