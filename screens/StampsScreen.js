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
    this.getStampsRewards(); // params에서 받지않고 서버에 한번더 물어볼거라면 사용할 것
  }

  getStampsRewards = () => {
    const { storeID, customerID } = this.props.navigation.state.params;
    const uri = '/customers/get-stamps-rewards-counts';
    axios
      .post(uri, { storeID, customerID })
      .then(response => {
        console.log(`${uri} 성공`, response.data);
        const { stamps, rewards } = response.data;
        this.onUpdateCounts(stamps, rewards);
      })
      .catch(error => {
        console.log(`${uri} 실패`, error);
      });
  };

  onPressTossButton = storeName => {
    const { storeID, customerID } = this.props.navigation.state.params;
    this.props.navigation.navigate('Toss', { storeName, storeID, customerID });
  };

  getStoreInfo = () => {
    const { storeID } = this.props.navigation.state.params;
    const uri = '/stores/get-store-info';
    axios
      .post(uri, { storeID })
      .then(response => {
        console.log(`${uri} 성공`, response.data);
        this.setState({ storeInfo: response.data });
      })
      .catch(error => {
        console.log(`${uri} 실패`, error);
      });
  };

  getMenuList = async () => {
    const { storeID } = this.props.navigation.state.params;
    console.log('getMenuList 스토어 아이디:', storeID);
    const uri = '/stores/menu-list';
    try {
      const response = await axios.post(uri, {
        storeID
      });

      console.log(`${uri} 성공`, response.data);
      this.setState({ menuList: response.data });
    } catch (error) {
      console.log(`${uri} 실패`, error);
    }
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

    // TODO: 토스하기 완료하고 다시 이 스크린으로 돌아왔을때, 변경된 스탬프수를 반영해야 함.
    // 아마도 stack 변화와 관련한 lifecycle method가 있을 것 같은데..

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
