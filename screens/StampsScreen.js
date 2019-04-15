import React, { Component } from 'react';
import { View, ScrollView, ActivityIndicator, Dimensions } from 'react-native';
import { Text, Button, Image } from 'react-native-elements';
import StampsPaper from '../components/Molecules/StampsPaper';
import RedeemStamps from '../components/Molecules/RedeemStamps';
import StoreInfo from '../components/Organisms/StoreInfo';
import StoreLargeMap from '../components/Organisms/StoreLargeMap';
import StampsCountsDisplay from '../components/Molecules/StampsCountsDisplay';

const storeInfo = {
  // 서버에서 컴포즈커피 성수점의 정보를 받아왔다 치자.
  address: '서울시 성동구 뚝섬역 근처',
  shopHours: '매일 09:00 ~ 20:00 (일요일 휴무)',
  contact: '02-123-2342'
};

export default class StampsScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam('storeName'),
      headerTitleStyle: {
        fontSize: 20
      }
    };
  };
  render() {
    const REQUIRED = 10; // Stores.STAMP
    const {
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
    // TODO: 1) navigation에서 전달받은 storeID를 가지고, 서버에서 Stores 테이블의 내용을 다 긁어와야 함
    //// 긁어온 내용을 StoreInfo 오브젝트로 만들어 StoreInfo 컴포넌트에 props로 넘겨줘야 함
    // TODO: 2) 한편, CustomerID, StoreID로 Stamps 테이블에 쿼리해서 사용가능한 쿠폰 개수를 받아와야 함

    return (
      <ScrollView style={{ flex: 1 }}>
        <StampsCountsDisplay stampsCounts={stampsCounts} />
        {/* TODO: StampPaper 컴포넌트의 props 형식 정리할것. Stamps 컴포넌트 제대로 구현할것 */}
        <StampsPaper countsObject={{ REQUIRED, count: stamps }} />

        <RedeemStamps />
        <Button title={'Toss하기'} />
        <Button title={'내 쿠폰함'} />
        <Image
          source={{ uri: img }}
          PlaceholderContent={<ActivityIndicator />}
          resizeMode={'cover'}
          style={{ width: storeImageSize.width, height: storeImageSize.height }}
        />
        <StoreInfo storeInfo={storeInfo} />
        <StoreLargeMap />
      </ScrollView>
    );
  }
}
