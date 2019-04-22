import React, { Component } from 'react';
import {
  View,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  AsyncStorage
} from 'react-native';
import { Text, Button, Image } from 'react-native-elements';
import StampsPaper from '../components/Molecules/StampsPaper';
import RedeemStamps from '../components/Molecules/RedeemStamps';
import StoreInfo from '../components/Organisms/StoreInfo';
import StoreLargeMap from '../components/Organisms/StoreLargeMap';
import StampsCountsDisplay from '../components/Molecules/StampsCountsDisplay';
import axios from '../modules/axios-connector';
import socket from '../modules/socket-connector';

// SearchSreen에서 매장을 선택하면 navigation.state.params를 통해 storeID와 customerID를 전달받는다.
// -> storeID와 customerID를 갖고 데이터들을 받아온다.

// API ==== 이 페이지에 필요한 static한 데이터를 받아온다
//// API 1. POST { storeID, customerID }
//// -> 매장에 적립한 스탬프 수, 교환권 수 [이건 적립페이지에서도 필요해서 따로 API 만들어야 함]
//// API 2. POST { storeID }
//// -> + 가게 주소, 영업시간, 휴무일, 전화번호
//// -> + 메뉴 리스트

// storeID -> 가게 정보
// const storeInfo = {
//   address: '서울시 성동구 뚝섬역 근처',
//   shopHours: '매일 09:00 ~ 20:00',
//   dayOff: '일',
//   contact: '02-123-2342'
// };

// storeID -> 메뉴 정보
// Menus 테이블에서, SELECT NAME, PRICE FROM MENUS WHERE STORE_ID = ?;
// const menuList = [
//   {
//     NAME: '아메리카노',
//     PRICE: 4000
//   },
//   {
//     NAME: '카페라뗴',
//     PRICE: 4500
//   },
//   {
//     NAME: '민트초코프라푸치노',
//     PRICE: 5000
//   }
// ];

export default class StampsScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam('storeName'),
      headerTitleStyle: {
        fontSize: 20
      }
    };
  };
  constructor(props) {
    super(props);
    const { stamps, rewards } = this.props.navigation.state.params;
    this.state = {
      stamps,
      rewards,
      storeInfo: {},
      menuList: []
    };
    this.getStoreInfo();
    this.getMenuList();
    // this.getStampsRewards(); // params에서 받지않고 서버에 한번더 물어볼거라면 사용할 것
  }

  getStampsRewards = () => {
    axios.defaults.baseURL = 'http://localhost:3030';
    const uri = '/customers-get-stamps-rewards-counts';
    axios
      .get(uri) // TODO: JSON서버 사용중일땐 그냥 GET으로 보내서 고정데이터를 받음. 실제 API 사용할땐 post로 바꿔야함
      .then(response => {
        console.log(`${uri} 성공`, response.data);
        const { stamps, rewards } = response.data;
        this.onUpdateCounts(stamps, rewards);
      })
      .catch(error => {
        console.log(`${uri} 실패`, error);
      });
    axios.defaults.baseURL =
      'http://ec2-13-115-51-251.ap-northeast-1.compute.amazonaws.com:3000';
  };

  onPressTossButton = storeName => {
    const { storeID, customerID } = this.props.navigation.state.params;
    this.props.navigation.navigate('Toss', { storeName, storeID, customerID });
  };

  getStoreInfo = () => {
    axios.defaults.baseURL = 'http://localhost:3030';
    const uri = '/get-store-info';
    axios
      .get(uri)
      .then(response => {
        console.log(`${uri} 성공`, response.data);
        this.setState({ storeInfo: response.data });
      })
      .catch(error => {
        console.log(`${uri} 실패`, error);
      });
    axios.defaults.baseURL =
      'http://ec2-13-115-51-251.ap-northeast-1.compute.amazonaws.com:3000';
  };

  getMenuList = () => {
    axios.defaults.baseURL = 'http://localhost:3030';
    const uri = '/get-menu-list';
    axios
      .get(uri)
      .then(response => {
        console.log(`${uri} 성공`, response.data);
        this.setState({ menuList: response.data });
      })
      .catch(error => {
        console.log(`${uri} 실패`, error);
      });
    axios.defaults.baseURL =
      'http://ec2-13-115-51-251.ap-northeast-1.compute.amazonaws.com:3000';
  };

  onUpdateCounts = (stamps, rewards) => {
    this.setState({
      stamps,
      rewards
    });
  };

  render() {
    const REQUIRED = 10; // Stores.STAMP
    const {
      customerID,
      storeID,
      storeName,
      distance,
      img
    } = this.props.navigation.state.params;
    const { storeInfo, menuList } = this.state;
    const { stamps, rewards } = this.state;
    const { onPressTossButton, onUpdateCounts } = this;
    const storeImage = {
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').width * 0.65 // 16:9 size = 0.65
    };

    // TODO: 1) navigation에서 전달받은 storeID를 가지고, 서버에서 Stores 테이블의 내용을 다 긁어와야 함
    //// 긁어온 내용을 StoreInfo 오브젝트로 만들어 StoreInfo 컴포넌트에 props로 넘겨줘야 함
    // TODO: 2) 한편, CustomerID, StoreID로 Stamps 테이블에 쿼리해서 사용가능한 쿠폰 개수를 받아와야 함

    return (
      <ScrollView style={{ flex: 1 }}>
        <StampsCountsDisplay stampsObject={{ stamps, REQUIRED }} />

        <StampsPaper stampsObject={{ stamps, REQUIRED }} />

        <RedeemStamps
          stamps={stamps}
          rewards={rewards}
          customerID={customerID}
          storeID={storeID}
          onUpdateCounts={onUpdateCounts}
        />

        <Text>FIXME:손님ID:{customerID}</Text>
        <Button
          title={'Toss하기'}
          onPress={() => {
            if (stamps === 0) {
              alert('스탬프가 없습니다');
              return;
            }
            onPressTossButton(storeName);
          }}
        />

        <Image
          source={{ uri: img }}
          PlaceholderContent={<ActivityIndicator />}
          resizeMode={'cover'}
          style={{ width: storeImage.width, height: storeImage.height }}
        />
        <StoreInfo storeInfo={storeInfo} menuList={menuList} />
        <StoreLargeMap />
      </ScrollView>
    );
  }
}
