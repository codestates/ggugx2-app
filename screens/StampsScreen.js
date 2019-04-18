import React, { Component } from 'react';
import { View, ScrollView, ActivityIndicator, Dimensions } from 'react-native';
import { Text, Button, Image } from 'react-native-elements';
import StampsPaper from '../components/Molecules/StampsPaper';
import RedeemStamps from '../components/Molecules/RedeemStamps';
import StoreInfo from '../components/Organisms/StoreInfo';
import StoreLargeMap from '../components/Organisms/StoreLargeMap';
import StampsCountsDisplay from '../components/Molecules/StampsCountsDisplay';
import axios from '../modules/axios-connector';

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
    this.state = {
      storeInfo: {},
      menuList: []
    };
    this.getStoreInfo();
    this.getMenuList();
  }

  onPressTossButton = storeName => {
    this.props.navigation.navigate('Toss', storeName);
  };

  getStoreInfo = () => {
    axios.defaults.baseURL = 'http://localhost:3000';
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
    axios.defaults.baseURL = 'http://localhost:3000';
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

  render() {
    const REQUIRED = 10; // Stores.STAMP
    const {
      customerID,
      storeID,
      storeName,
      distance,
      stamps, // Stamps 테이블 : 사용가능한 스탬프 개수
      img
    } = this.props.navigation.state.params;
    const stampsCounts = { stamps, REQUIRED };
    const storeImageSize = {
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').width * 0.65 // 16:9 size = 0.65
    };
    const { onPressTossButton } = this;
    const { storeInfo, menuList } = this.state;
    // TODO: 1) navigation에서 전달받은 storeID를 가지고, 서버에서 Stores 테이블의 내용을 다 긁어와야 함
    //// 긁어온 내용을 StoreInfo 오브젝트로 만들어 StoreInfo 컴포넌트에 props로 넘겨줘야 함
    // TODO: 2) 한편, CustomerID, StoreID로 Stamps 테이블에 쿼리해서 사용가능한 쿠폰 개수를 받아와야 함

    return (
      <ScrollView style={{ flex: 1 }}>
        <StampsCountsDisplay stampsCounts={stampsCounts} />
        {/* TODO: StampPaper 컴포넌트의 props 형식 정리할것. Stamps 컴포넌트 제대로 구현할것 */}
        <StampsPaper stampsObject={{ REQUIRED, count: stamps }} />

        <RedeemStamps />
        <Text>손님ID:{customerID}</Text>
        <Button
          title={'Toss하기'}
          onPress={() => {
            onPressTossButton(storeName);
          }}
        />
        {/* <Button title={'내 쿠폰함'} /> */}
        <Image
          source={{ uri: img }}
          PlaceholderContent={<ActivityIndicator />}
          resizeMode={'cover'}
          style={{ width: storeImageSize.width, height: storeImageSize.height }}
        />
        <StoreInfo storeInfo={storeInfo} menuList={menuList} />
        <StoreLargeMap />
      </ScrollView>
    );
  }
}
