import React, { Component } from 'react';
import {
  View,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  AsyncStorage
} from 'react-native';
import {
  Text,
  Button,
  Image,
  ThemeProvider,
  Header
} from 'react-native-elements';
import { Constants } from 'expo';
import { NavigationEvents } from 'react-navigation';
import StampsPaper from '../components/Molecules/StampsPaper';
import RedeemStamps from '../components/Molecules/RedeemStamps';
import StoreInfo from '../components/Organisms/StoreInfo';
import StoreLargeMap from '../components/Organisms/StoreLargeMap';
import StampsCountsDisplay from '../components/Molecules/StampsCountsDisplay';
import axios from '../modules/axios-connector';

const theme = {
  Button: {
    buttonStyle: { backgroundColor: 'rgb(255, 205, 55)', height: 50 },
    titleStyle: { color: 'black', fontWeight: 'bold' }
  }
};
export default class StampsScreen extends Component {
  // static navigationOptions = ({ navigation }) => {
  //   return {
  //     title: navigation.getParam('storeName'),
  //     headerTitleStyle: {
  //       fontSize: 20
  //     }
  //   };
  // };
  static navigationOptions = {
    header: null
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
    const { storeID, customerID } = this.props.navigation.state.params;
    const uri = '/customers/get-stamps-rewards-counts';
    axios
      .post(uri, { storeID, customerID })
      .then(response => {
        const { stamps, rewards } = response.data;
        this.onUpdateCounts(stamps, rewards);
      })
      .catch(error => {});
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
        this.setState({ storeInfo: response.data });
      })
      .catch(error => {});
  };

  getMenuList = async () => {
    const { storeID } = this.props.navigation.state.params;

    const uri = '/stores/menu-list';
    try {
      const response = await axios.post(uri, {
        storeID
      });

      this.setState({ menuList: response.data });
    } catch (error) {}
  };

  onUpdateCounts = (stamps, rewards) => {
    this.setState({
      stamps,
      rewards
    });
  };

  render() {
    const REQUIRED = 10; // Stores.STAMP FIXME: 이놈의 존재를 잊어서 API중에 이걸 응답해주는놈이 없다 ㅋㅋ 서버에서 받아오는게 맞지만 그래봤자 고정값.
    const {
      customerID,
      storeID,
      storeName,
      img,
      latitude,
      longitude
    } = this.props.navigation.state.params;
    const { storeInfo, menuList } = this.state;
    const { stamps, rewards } = this.state;
    const { onPressTossButton, onUpdateCounts } = this;
    const storeImage = {
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').width * 0.65 // 16:9 size = 0.65
    };
    const imgPlaceholder = img
      ? { uri: img }
      : require('../assets/images/muzi_placeholder.jpg');
    return (
      <ScrollView style={{ flex: 1, marginTop: Constants.statusBarHeight }}>
        <ThemeProvider theme={theme}>
          <NavigationEvents
            onWillFocus={() => {
              this.getStampsRewards();
            }}
          />

          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'space-between'
            }}
          >
            <Button
              title={'뒤로'}
              onPress={() => {
                this.props.navigation.goBack();
              }}
              containerStyle={{ width: 60 }}
              buttonStyle={{
                backgroundColor: 'white',
                paddingVertical: 5,
                justifyContent: 'flex-end'
              }}
              titleStyle={{ color: '#666', fontWeight: 'normal' }}
            />
            <Text
              style={{
                flex: 1,
                textAlign: 'center',
                fontSize: 30,
                fontWeight: 'bold',
                paddingTop: 6
              }}
            >
              {storeName}
            </Text>
            <View style={{ width: 60 }} />
          </View>

          <StampsCountsDisplay stampsObject={{ stamps, REQUIRED }} />

          <StampsPaper stampsObject={{ stamps, REQUIRED }} />

          <RedeemStamps
            stamps={stamps}
            rewards={rewards}
            customerID={customerID}
            storeID={storeID}
            onUpdateCounts={onUpdateCounts}
          />

          <Button
            title={'스탬프 토스하기'}
            onPress={() => {
              if (stamps === 0) {
                alert('스탬프가 없습니다');
                return;
              }
              onPressTossButton(storeName);
            }}
            titleStyle={{ fontSize: 22, color: 'hsl(19, 90%, 95%)' }}
            buttonStyle={{ backgroundColor: 'hsl(19, 67%, 55%)' }}
          />

          <Image
            source={imgPlaceholder}
            PlaceholderContent={<ActivityIndicator color={'white'} />}
            resizeMode={'cover'}
            style={{
              width: storeImage.width,
              height: storeImage.height
              // marginTop: 10
            }}
          />
          <StoreInfo storeInfo={storeInfo} menuList={menuList} />

          <StoreLargeMap coordinates={{ latitude, longitude }} />
        </ThemeProvider>
      </ScrollView>
    );
  }
}
