import React, { Component } from 'react';
import {
  AsyncStorage,
  View,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableHighlight,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform
} from 'react-native';
import { Constants, Location, Permissions } from 'expo';
import {
  Button,
  ListItem,
  Text,
  ThemeProvider,
  SearchBar,
  Header
} from 'react-native-elements';
import SearchResultEntry from '../components/Molecules/SearchResultEntry';
import axios from '../modules/axios-connector';

// TODO: 검색 결과를 서버에서 받아온다
// 1. 검색어 미입력시 가까운 10개 매장의 리스트를 받는다
// 2. 검색어(메뉴명)가 있다면, 해당 메뉴를 등록한 카페들 중 가까운 10개 매장의 리스트를 받는다
// 3. sort와 filter 기능은 나중에 생각하자..
// const searchResult = [
//   {
//     storeID: 0,
//     storeName: '스벅 성수',
//     distance: '234m',
//     stamps: 10,
//     isOpen: true,
//     haveRewards: true,
//     img:
//       'https://www.royalparks.org.uk/_media/images/the-regents-park-and-primrose-hill/the-broad-walk-cafe/The-Broad-Walk-Cafe-Interior.jpg/w_1200.jpg'
//   }
// ];

const theme = {
  View: {
    style: {
      borderWidth: 1
    }
  },
  Text: {
    style: {
      borderWidth: 1,
      borderColor: 'blue'
    }
  },
  Button: {
    type: 'clear',
    style: { width: 74 },
    titleStyle: {
      color: 'black'
    }
  },
  Header: {
    centerContainerStyle: { flex: 1 },
    leftContainerStyle: { flex: 0 },
    rightContainerStyle: { flex: 0 },
    containerStyle: {
      backgroundColor: 'white'
    }
  }
};

const s = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
    flexDirection: 'column',
    paddingTop: 22
  },
  searchFiltersView: {
    width: '100%',
    // height: 40,
    backgroundColor: '#adf',
    // padding: 10,
    justifyContent: 'space-around',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    padding: 0
  },
  searchResultsView: {
    flex: 2,
    width: '100%',
    backgroundColor: '#eee'
  }
});

export default class SearchScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchInputValue: '',
      searchResult: [],
      errorMessage: null,
      location: null
    };
    this.getCustomerID();
    this.getSearchResult();
  }
  static navigationOptions = {
    header: null
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
    console.log('로케이션!!!!', location);
    console.log(
      'latitude : ',
      location.coords.latitude,
      'longitude : ',
      location.coords.longitude
    );
  };

  updateSearch = text => {
    this.setState({ searchInputValue: text });
  };

  getCustomerID = async () => {
    const { customerID } = JSON.parse(
      await AsyncStorage.getItem('ggugCustomerToken')
    );

    console.log('TCL: SearchScreen -> getCustomerID -> customerID', customerID);

    this.setState({ customerID });
  };

  getSearchResult = () => {
    axios.defaults.baseURL = 'http://localhost:3030';
    const uri = '/search-result';
    axios
      .get(uri)
      .then(response => {
        console.log(`${uri} 성공`);
        this.setState({ searchResult: response.data });
        console.log('검색결과 : ', response.data);
      })
      .catch(error => {
        console.log(`${uri} 실패`, error);
      });
    axios.defaults.baseURL =
      'http://ec2-13-115-51-251.ap-northeast-1.compute.amazonaws.com:3000';
  };

  render() {
    const { onPressLogout } = this;
    const { searchInputValue, searchResult, customerID } = this.state;

    return (
      <ThemeProvider theme={theme}>
        {/* 최상위 View */}
        <View style={s.container}>
          {/* 검색창 */}
          <Header
            centerComponent={
              <SearchBar
                placeholder="원하는 메뉴로 검색해보세요!"
                onChangeText={this.updateSearch}
                value={searchInputValue}
                platform={'ios'}
                containerStyle={{
                  backgroundColor: 'white'
                }}
              />
            }
          />

          {/* 검색결과 정렬 & 필터 버튼들 */}
          <View style={s.searchFiltersView}>
            <Button title={'거리'} />
            <Button title={'스탬프'} />
            <Button title={'가격'} />
            <Button title={'교환권'} />
            <Button title={'영업중'} />
          </View>
          {/* 검색 결과 */}
          <View style={s.searchResultsView}>
            <ScrollView style={{ borderWidth: 1 }}>
              {searchResult.map((item, i) => (
                <SearchResultEntry
                  itemObject={item}
                  key={i}
                  onPress={() => {
                    this.props.navigation.navigate('Stamps', {
                      ...item,
                      customerID
                    });
                  }}
                />
              ))}
            </ScrollView>
          </View>
        </View>
      </ThemeProvider>
    );
  }
}
