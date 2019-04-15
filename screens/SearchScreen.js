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
  StyleSheet
} from 'react-native';
import {
  Button,
  ListItem,
  Text,
  ThemeProvider,
  SearchBar,
  Header
} from 'react-native-elements';
import SearchResultEntry from '../components/Molecules/SearchResultEntry';

const list = [
  {
    storeID: 0,
    storeName: '스벅 성수',
    distance: '234m',
    stamps: 10,
    isOpen: true,
    haveRewards: true,
    img:
      'https://www.royalparks.org.uk/_media/images/the-regents-park-and-primrose-hill/the-broad-walk-cafe/The-Broad-Walk-Cafe-Interior.jpg/w_1200.jpg'
  },
  {
    storeID: 1,
    storeName: '이디야 성수',
    distance: '646m',
    stamps: 8,
    isOpen: true,
    haveRewards: true,
    img: 'http://www.jacobsamuelhotel.com/files//Cafe_Popular_bar.jpg'
  },
  {
    storeID: 2,
    storeName: '컴포즈커피 성수점',
    distance: '700m',
    stamps: 3,
    isOpen: false,
    haveRewards: false,
    img:
      'http://composecoffee.com/bizdemo58464/component/board/board_6/u_image/1/2051342575_thumb-01.jpg'
  },
  {
    storeID: 3,
    storeName: '할리스커피 건대입구점',
    distance: '1.3km',
    stamps: 5,
    isOpen: true,
    haveRewards: false,
    img:
      'http://danmee.chosun.com/site/data/img_dir/2013/07/17/2013071700688_0.jpg'
  },
  {
    storeID: 5,
    storeName: '스벅 성수',
    distance: '234m',
    stamps: 10,
    isOpen: true,
    haveRewards: true,
    img:
      'https://www.royalparks.org.uk/_media/images/the-regents-park-and-primrose-hill/the-broad-walk-cafe/The-Broad-Walk-Cafe-Interior.jpg/w_1200.jpg'
  },
  {
    storeID: 8,
    storeName: '스벅 성수',
    distance: '234m',
    stamps: 10,
    isOpen: true,
    haveRewards: true,
    img:
      'https://www.royalparks.org.uk/_media/images/the-regents-park-and-primrose-hill/the-broad-walk-cafe/The-Broad-Walk-Cafe-Interior.jpg/w_1200.jpg'
  },
  {
    storeID: 13,
    storeName: '스벅 성수',
    distance: '234m',
    stamps: 10,
    isOpen: true,
    haveRewards: true,
    img:
      'https://www.royalparks.org.uk/_media/images/the-regents-park-and-primrose-hill/the-broad-walk-cafe/The-Broad-Walk-Cafe-Interior.jpg/w_1200.jpg'
  },
  {
    storeID: 21,
    storeName: '스벅 성수',
    distance: '234m',
    stamps: 10,
    isOpen: true,
    haveRewards: true,
    img:
      'https://www.royalparks.org.uk/_media/images/the-regents-park-and-primrose-hill/the-broad-walk-cafe/The-Broad-Walk-Cafe-Interior.jpg/w_1200.jpg'
  },
  {
    storeID: 413,
    storeName: '스벅 성수',
    distance: '234m',
    stamps: 10,
    isOpen: true,
    haveRewards: true,
    img:
      'https://www.royalparks.org.uk/_media/images/the-regents-park-and-primrose-hill/the-broad-walk-cafe/The-Broad-Walk-Cafe-Interior.jpg/w_1200.jpg'
  }
];

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
      searchInputValue: ''
    };
  }
  static navigationOptions = {
    header: null
  };

  updateSearch = text => {
    this.setState({ searchInputValue: text });
  };

  render() {
    const { onPressLogout } = this;
    const { searchInputValue } = this.state;

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
              {list.map((item, i) => (
                <SearchResultEntry
                  itemObject={item}
                  key={i}
                  onPress={() => {
                    this.props.navigation.navigate('Stamps', item);
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
