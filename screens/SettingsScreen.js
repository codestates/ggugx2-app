import React from 'react';
// import { ExpoConfigView } from '@expo/samples';
import { AsyncStorage, View } from 'react-native';
import { Text } from 'react-native-elements';
import { Button } from 'react-native-elements';

export default class SettingsScreen extends React.Component {
  static navigationOptions = {
    title: '내 정보'
  };
  onPressLogout = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate('AuthLoading');
  };
  render() {
    /* Go ahead and delete ExpoConfigView and replace it with your
     * content, we just wanted to give you a quick view of your config */
    const { onPressLogout } = this;
    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Text
          style={{
            fontSize: 22,
            textAlign: 'center'
          }}
        >
          정말 로그아웃 하시겠어요?
        </Text>
        <Button
          title={'로그아웃'}
          onPress={onPressLogout}
          buttonStyle={{
            borderRadius: 100,
            height: 50,
            width: 200,
            backgroundColor: 'hsl(200, 80%, 60%)'
          }}
          containerStyle={{ alignSelf: 'center', width: 200, margin: 10 }}
          titleStyle={{
            color: 'hsl(200, 90%, 95%)',
            fontWeight: 'bold',
            fontSize: 24
          }}
        />
      </View>
    );
  }
}
