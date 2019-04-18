import React, { Component } from 'react';
import { View, Modal, ScrollView, AsyncStorage } from 'react-native';
import { Button, Text, ThemeProvider, Header } from 'react-native-elements';
import StoresEntry from '../components/Molecules/TextTextEntry';
import axios from '../modules/axios-connector';

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
//   redeems: 1
// };

export default class CollectionScreen extends Component {
  static navigationOptions = {
    header: null
  };
  constructor(props) {
    super(props);
    this.state = {
      customerID: null,
      modalVisible: false,
      stampsObject: {},
      nearbyStoresList: []
    };
    this.getCustomerID();
    this.getStampsRedeemsCounts();
    this.getNearbyStoresList();
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
  };

  getStampsRedeemsCounts = () => {
    // const response = await axiosGet('/get-stamps-redeems-counts');
    // this.setState({ stampsObject: response.data });

    axios.defaults.baseURL = 'http://localhost:3000';
    axios
      .get('/get-stamps-redeems-counts')
      .then(response => {
        console.log('getStampsRedeemsCount 성공');
        this.setState({ stampsObject: response.data });
      })
      .catch(error => {
        console.log('getStampsRedeemsCount 실패', error);
      });
    axios.defaults.baseURL =
      'http://ec2-13-115-51-251.ap-northeast-1.compute.amazonaws.com:3000';
  };

  getNearbyStoresList = () => {
    axios.defaults.baseURL = 'http://localhost:3000';
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
    const { theme } = this;
    const { stampsObject, nearbyStoresList } = this.state;
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
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {}}
          style={{ backgroundColor: '#000000aa' }}
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
              <Text h4>교환권💵: {stampsObject.redeems}개</Text>
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
                // FIXME: API에 토큰 검사하도록 요청날리기 테스트임
                axios
                  .get('/tests')
                  .then(response => {
                    console.log(response.data);
                    this.setModalVisible(true);
                  })
                  .catch(error => console.log(error));
              }}
            />
          </View>
        </View>
      </ThemeProvider>
    );
  }
}
