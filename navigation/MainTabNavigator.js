import React from 'react';
import { Platform } from 'react-native';
import {
  createStackNavigator,
  createBottomTabNavigator
} from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import SearchScreen from '../screens/SearchScreen';
// import ChatScreen from '../screens/ChatScreen';
import SettingsScreen from '../screens/SettingsScreen';
import CollectionScreen from '../screens/CollectionScreen';
import StampsScreen from '../screens/StampsScreen';
import TossScreen from '../screens/TossScreen';

const CollectionStack = createStackNavigator({
  Collection: CollectionScreen
});

CollectionStack.navigationOptions = {
  tabBarLabel: '적립',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-star${focused ? '' : '-outline'}`
          : 'md-star'
      }
    />
  )
};

const SearchStack = createStackNavigator(
  {
    Search: SearchScreen,
    Stamps: StampsScreen,
    Toss: TossScreen
  },
  {
    mode: 'card'
  }
);

SearchStack.navigationOptions = {
  tabBarLabel: '매장검색',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-information-circle${focused ? '' : '-outline'}`
          : 'md-information-circle'
      }
    />
  )
};

// const ChatStack = createStackNavigator({
//   Chat: ChatScreen
// });

// ChatStack.navigationOptions = {
//   tabBarLabel: '1:1문의',
//   tabBarIcon: ({ focused }) => (
//     <TabBarIcon
//       focused={focused}
//       name={Platform.OS === 'ios' ? 'ios-link' : 'md-link'}
//     />
//   )
// };

const SettingsStack = createStackNavigator({
  Settings: SettingsScreen
});

SettingsStack.navigationOptions = {
  tabBarLabel: '로그아웃',
  tabBarIcon: ({ focused }) => (
    // <TabBarIcon
    //   focused={focused}
    //   name={Platform.OS === 'ios' ? 'ios-options' : 'md-options'}
    // />
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-log-out' : 'md-log-out'}
    />
  )
};

export default createBottomTabNavigator({
  CollectionStack,
  SearchStack,
  // ChatStack,
  SettingsStack
});
