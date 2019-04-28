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
  Platform,
  Image
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
  },
  ButtonGroup: {
    containerStyle: {
      height: 45,
      borderWidth: 0,
      borderRadius: 0,
      borderBottomWidth: 0,
      marginTop: 0,
      marginBottom: 0
    },
    buttonStyle: { backgroundColor: 'rgb(255, 202, 54)' },
    selectedButtonStyle: { backgroundColor: 'hsl(45, 98%, 70%)' },
    selectedTextStyle: { color: 'rgb(223, 58, 47)' },
    innerBorderStyle: { width: 0, color: 'black' },
    textStyle: { color: '#333', fontSize: 19 }
  }
};

const s = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
    flexDirection: 'column',
    paddingTop: 0
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
    backgroundColor: 'white'
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
      selectedIndexes: [],
      isSearching: false
    };
    this.coordinates = {
      longitude: null,
      latitude: null
    };
    this.getCustomerID();
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

    this.searchStores('아메리카노', customerID);
  };

  searchStores = async (query, customerID = this.state.customerID) => {
    this.setState({ isSearching: true });
    console.log('입력된 검색어 ::::', query);
    query = query.trim();
    console.log('trimmed 검색어 ::::', query);
    if (query === '') {
      alert('검색어를 입력해주세요!');
      return;
    }
    const limit = 10;
    // 처음 검색 스크린 띄울때 location을 받아온 다음에야 기본리스트를 쿼리할 수 있으므로 여기서 위치를 받아야한다
    let location = await Location.getCurrentPositionAsync({});
    const { longitude, latitude } = location.coords;
    this.coordinates = { longitude, latitude };
    const uri = '/stores/search';
    try {
      console.log('/stores/search API request', {
        query,
        customerID,
        coordinate: { latitude, longitude },
        limit
      });
      const response = await axios.post(uri, {
        query,
        customerID,
        coordinate: { lattitude: latitude, longitude },
        limit
      });
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
            distance,
            openhour,
            closehour,
            menuFound,
            dayoff
          } = entry;
          ////////////////////// 운영중 여부
          console.log('휴무일', dayoff);
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
          // 휴무일 반영
          const currentDay = currentTime.getDay(); // 일요일: 0 ~ 토요일: 6
          const daysString = '일월화수목금토';
          const currentDayLocale = daysString[currentDay];

          if (dayoff.includes(currentDayLocale)) {
            isOpen = false;
          }
          //////////////////////
          const haveRewards = rewards > 0 ? true : false;
          console.log(
            distance,
            openhour,
            closehour,
            isOpen,
            rewards,
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

      this.setState(
        { searchResult, originalSearchResult: searchResult },
        () => {
          // 기존에 선택된 정렬, 필터 기준이 있을 경우를 위해
          this.sort(this.state.selectedIndex);
          this.filter(this.state.selectedIndexes);
          this.setState({ isSearching: false });
        }
      );
    } catch (error) {
      console.log(`${uri} 실패`, error);
    }
  };

  sort = index => {
    let { searchResult } = this.state;
    const SortedSearchResult = searchResult.slice();
    if (index === 0) {
      SortedSearchResult.sort((a, b) => {
        return a.distance - b.distance;
      });
    } else if (index === 1) {
      SortedSearchResult.sort((a, b) => {
        return b.stamps - a.stamps;
      });
    } else if (index === 2) {
      SortedSearchResult.sort((a, b) => {
        return a.menuFound.price - b.menuFound.price;
      });
    }

    this.setState({
      searchResult: SortedSearchResult
    });
  };

  filter = index => {
    const { sort } = this;
    const { originalSearchResult } = this.state;
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
      this.setState(
        {
          searchResult: originalSearchResult
        },
        () => {
          sort(this.state.selectedIndex);
        }
      );
    } else {
      this.setState(
        {
          searchResult: filteredSearchResult
        },
        () => {
          sort(this.state.selectedIndex);
        }
      );
    }
  };

  render() {
    const {
      searchStores,
      updateIndex,
      updateFilter,
      sort,
      filter,
      coordinates
    } = this;
    const {
      searchInputValue,
      searchResult,
      customerID,
      selectedIndex,
      selectedIndexes,
      isSearching
    } = this.state;
    const loading = require('../assets/images/loadingfriends.gif');
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
                returnKeyType={'search'}
                onSubmitEditing={() => {
                  // this.setState({ isSearching: true });
                  searchStores(searchInputValue);
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
                width: '60%'
              }}
            />
            <ButtonGroup
              onPress={index => {
                updateFilter(index);
                filter(index);
              }}
              selectedIndexes={selectedIndexes}
              buttons={['영업중', '교환권']}
              containerStyle={{
                width: '40%'
              }}
              selectMultiple={true}
            />
          </View>
          {/* 검색 결과 */}
          <View style={s.searchResultsView}>
            <ScrollView style={{ borderWidth: 0 }}>
              {isSearching && (
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#eee',
                    padding: 10
                  }}
                >
                  <Image source={loading} style={{ width: 40, height: 40 }} />
                  <Text
                    style={{ textAlign: 'center', margin: 0, fontSize: 15 }}
                  >
                    검색중
                  </Text>
                </View>
              )}
              {!isSearching && searchResult.length === 0 ? (
                <Text style={{ textAlign: 'center', margin: 20 }}>
                  결과가 없습니다!
                </Text>
              ) : (
                searchResult.map((item, i) => (
                  <SearchResultEntry
                    itemObject={item}
                    key={i}
                    onPress={() => {
                      this.props.navigation.navigate('Stamps', {
                        ...item,
                        customerID,
                        coordinates
                      });
                    }}
                  />
                ))
              )}
            </ScrollView>
          </View>
        </View>
      </ThemeProvider>
    );
  }
}
