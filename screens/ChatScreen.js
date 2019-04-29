import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Header, Button } from 'react-native-elements';
import { ExpoLinksView } from '@expo/samples';
import axios from '../modules/axios-connector';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff'
  }
});

export default class ChatScreen extends React.Component {
  static navigationOptions = {
    header: null
  };
  onPressHandler = () => {
    // axios
    //   .get('/tests')
    //   .then(response => {
    //   })
    //   .catch(error =>
  };
  render() {
    return (
      <View>
        <Header
          placement={'center'}
          centerComponent={{ text: '1:1 문의', style: { fontSize: 30 } }}
          backgroundColor={'white'}
        />
        <ScrollView style={styles.container}>
          {/* Go ahead and delete ExpoLinksView and replace it with your
           * content, we just wanted to provide you with some helpful links */}
          <ExpoLinksView />
          <Button title="토큰끼워넣기테스트" onPress={this.onPressHandler} />
        </ScrollView>
      </View>
    );
  }
}
