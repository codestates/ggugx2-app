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
  Header,
  ButtonGroup
} from 'react-native-elements';
import SearchResultEntry from '../components/Molecules/SearchResultEntry';
import axios from '../modules/axios-connector';
import geolib from 'geolib';

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
      borderWidth: 0,
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
    justifyContent: 'space-around',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    padding: 0,
    margin: 0
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
      originalSearchResult: [],
      errorMessage: null,
      selectedIndex: 0,
      selectedIndexes: []
      // location: null
    };
    this.getCustomerID();
    this.searchStores();
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

    // let location = await Location.getCurrentPositionAsync({});
    // this.setState({ location });
    // console.log('로케이션!!!!', location);
    // console.log(
    //   'latitude : ',
    //   location.coords.latitude,
    //   'longitude : ',
    //   location.coords.longitude
    // );
  };

  updateSearch = text => {
    this.setState({ searchInputValue: text });
  };

  updateIndex = selectedIndex => {
    this.setState({ selectedIndex });
  };
  updateFilter = indexes => {
    console.log('선택된 필터들 : ', indexes);
    this.setState({ selectedIndexes: indexes });
  };

  getCustomerID = async () => {
    const { customerID } = JSON.parse(
      await AsyncStorage.getItem('ggugCustomerToken')
    );

    console.log('TCL: SearchScreen -> getCustomerID -> customerID', customerID);

    this.setState({ customerID });
  };

  searchStores = async query => {
    console.log('입력된 검색어 ::::', query);
    // 처음 검색 스크린 띄울때 location을 받아온 다음에 기본리스트를 쿼리할 수 있으므로 여기서 위치를 받아야한다
    let location = await Location.getCurrentPositionAsync({});
    axios.defaults.baseURL = 'http://localhost:3030';
    const uri = '/stores-search';
    try {
      const response = await axios.get(uri);
      console.log(`${uri} 성공`);
      console.log('검색결과 : ', response.data);
      let rawResult = response.data;
      // 계산해 변환이 필요한 속성들 조작
      let searchResult = rawResult
        .map(entry => {
          const {
            storeID,
            storeName,
            stamps,
            img,
            rewards,
            coordinate,
            openhour,
            closehour,
            menuFound
          } = entry;
          ////////////////////// 거리계산
          const from = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude
          };
          const distance = geolib.getDistance(from, coordinate);
          console.log('거리: ', distance);
          ////////////////////// 운영중 여부
          let isOpen = false; // openhour, closehour 이용
          // 방법 1. open, close를 오늘의 open,close로 바꿔 milisec으로 바꾸고, 현시각 milisec과 대소비교
          const currentTime = new Date();
          const currentUnixTime = Number(currentTime);
          const openUnixTime = currentTime.setHours(...openhour.split(':'), 0);
          const closeUnixTime = currentTime.setHours(
            ...closehour.split(':'),
            0
          );
          if (
            currentUnixTime >= openUnixTime &&
            currentUnixTime <= closeUnixTime
          ) {
            isOpen = true;
          }
          //////////////////////
          const haveRewards = rewards > 0 ? true : false;
          console.log(
            coordinate,
            openhour,
            closehour,
            isOpen,
            haveRewards,
            menuFound
          );
          return {
            storeID,
            storeName,
            stamps,
            img,
            distance,
            isOpen,
            haveRewards,
            menuFound
          };
        })
        .sort((a, b) => a.distance - b.distance);

      this.setState({ searchResult, originalSearchResult: searchResult });
    } catch (error) {
      console.log(`${uri} 실패`, error);
    }
    axios.defaults.baseURL =
      'http://ec2-13-115-51-251.ap-northeast-1.compute.amazonaws.com:3000';
  };

  sort = index => {
    let { searchResult } = this.state;
    const SortedSearchResult = searchResult.slice();
    if (index === 0) {
      console.log('거리순!!');
      SortedSearchResult.sort((a, b) => {
        return a.distance - b.distance;
      });
    } else if (index === 1) {
      console.log('스탬프순!!');
      SortedSearchResult.sort((a, b) => {
        return b.stamps - a.stamps;
      });
    } else if (index === 2) {
      console.log('가격순!!');
      SortedSearchResult.sort((a, b) => {
        return a.menuFound.price - b.menuFound.price;
      });
    }

    this.setState({
      searchResult: SortedSearchResult
    });
  };

  filter = index => {
    const { originalSearchResult } = this.state;
    const { searchResult } = this.state;
    // let filteredSearchResult = searchResult.slice();
    let filteredSearchResult = originalSearchResult.slice();
    const filters = { open: index.includes(0), rewards: index.includes(1) };

    if (filters.open && filters.rewards) {
      filteredSearchResult = filteredSearchResult.filter(
        entry => entry.isOpen && entry.haveRewards
      );
      console.log('영업중 + 교환권', filteredSearchResult);
    } else if (filters.open) {
      filteredSearchResult = filteredSearchResult.filter(entry => entry.isOpen);
      console.log('영업중인곳 : ', filteredSearchResult);
    } else if (filters.rewards) {
      filteredSearchResult = filteredSearchResult.filter(
        entry => entry.haveRewards
      );
      console.log('교환권있는곳 : ', filteredSearchResult);
    }

    if (!filters.open && !filters.rewards) {
      this.setState({
        searchResult: originalSearchResult
      });
    } else {
      this.setState({
        searchResult: filteredSearchResult
      });
    }
  };

  render() {
    const { searchStores, updateIndex, updateFilter, sort, filter } = this;
    const {
      searchInputValue,
      searchResult,
      customerID,
      selectedIndex,
      selectedIndexes
    } = this.state;

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
                onKeyPress={e => {
                  // TODO: 엔터 입력시 검색 쿼리 함수 실행해야 하는데 엔터는 이벤트가 발생 안한다
                  console.log('눌린 키', e.nativeEvent.key);
                  if (e.nativeEvent.key === 'Enter') {
                    console.log('엔터눌림!');
                    searchStores(searchInputValue);
                  }
                }}
              />
            }
          />

          {/* 검색결과 정렬 & 필터 버튼들 */}
          <View style={s.searchFiltersView}>
            <ButtonGroup
              onPress={index => {
                updateIndex(index);
                sort(index);
              }}
              selectedIndex={selectedIndex}
              buttons={['거리', '스탬프', '가격']}
              containerStyle={{
                width: '60%',
                height: 45,
                borderWidth: 0,
                borderRadius: 0,
                borderBottomWidth: 0,
                borderBottomColor: 'black',
                margin: 0,
                padding: 0,
                marginTop: 0,
                marginBottom: 0
              }}
              buttonStyle={{ backgroundColor: 'rgb(255, 202, 54)' }}
              selectedButtonStyle={{ backgroundColor: 'hsl(45, 98%, 70%)' }}
              selectedTextStyle={{ color: 'rgb(223, 58, 47)' }}
              innerBorderStyle={{ width: 0, color: 'black' }}
              textStyle={{ color: '#333', fontSize: 19 }}
            />
            <ButtonGroup
              onPress={index => {
                updateFilter(index);
                filter(index);
                setTimeout(() => {
                  sort(this.state.selectedIndex);
                }, 0);
                // setState가 끝나서 searchResult가 변한 다음 sort가 되어야 해서
                // setTimeout으로 비동기 처리하게 만들었더니 작동은 하는데 중간과정이 보인다.
              }}
              selectedIndexes={selectedIndexes}
              buttons={['영업중', '교환권']}
              containerStyle={{
                width: '40%',
                height: 45,
                borderWidth: 0,
                borderRadius: 0,
                borderBottomWidth: 0,
                borderBottomColor: 'black',
                margin: 0,
                padding: 0,
                marginTop: 0,
                marginBottom: 0
              }}
              buttonStyle={{ backgroundColor: 'rgb(255, 202, 54)' }}
              selectedButtonStyle={{ backgroundColor: 'hsl(45, 98%, 70%)' }}
              selectedTextStyle={{ color: 'rgb(223, 58, 47)' }}
              innerBorderStyle={{ width: 0, color: 'black' }}
              textStyle={{ color: '#333', fontSize: 19 }}
              selectMultiple={true}
            />
          </View>
          {/* 검색 결과 */}
          <View style={s.searchResultsView}>
            <ScrollView style={{ borderWidth: 0 }}>
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
