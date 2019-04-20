import React, { Component } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Text, Image, Button, Overlay } from 'react-native-elements';
import RewardsBadge from '../Atoms/RewardsBadge';
import axios from '../../modules/axios-connector';

export default class RedeemStamps extends Component {
  state = {
    modalVisible: false,
    isComplete: false,
    stage: 0,
    status: '완료!'
  };
  render() {
    const { rewards, customerID, storeID } = this.props;
    const { modalVisible, isComplete, stage, status } = this.state;
    const stampImgChecked = require('../../assets/images/stamp-checked.png');
    const stampSize = 50;
    return (
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'nowrap',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 5,
          borderWidth: 1
        }}
      >
        <Overlay
          isVisible={modalVisible}
          width={'80%'}
          height={200}
          onBackdropPress={() => {
            isComplete &&
              this.setState({ modalVisible: false, isComplete: false });
          }}
        >
          {stage === 0 ? (
            <View>
              <Text>스탬프 10개를 교환권 1개로 교환하시겠습니까?</Text>
              <Button
                title={'교환합시다!'}
                onPress={() => {
                  this.setState({ stage: 1 });
                  // exchange API 리퀘스트
                  axios.defaults.baseURL = 'http://localhost:3000';
                  const uri = '/customer/exchange';
                  axios
                    .post(uri, {
                      customerID,
                      storeID
                    })
                    .then(response => {
                      console.log(`${uri} 성공`, response.data);
                      this.setState({
                        isComplete: true
                      });
                    })
                    .catch(error => {
                      console.log(`${uri} 실패`, error);
                      this.setState({
                        isComplete: true, // FIXME: 임시로 넘어가게만 했음,
                        status: '실패!'
                      });
                    });
                  axios.defaults.baseURL =
                    'http://ec2-13-115-51-251.ap-northeast-1.compute.amazonaws.com:3000';
                }}
              />
            </View>
          ) : !isComplete ? (
            <View>
              <ActivityIndicator />
              <Text>교환중..</Text>
            </View>
          ) : (
            <View>
              <Text>교환 {status}</Text>
              <Button
                title={'닫기'}
                onPress={() => {
                  this.setState({ modalVisible: false, isComplete: false });
                }}
              />
            </View>
          )}
        </Overlay>
        {/* <Image
          source={stampImgChecked}
          style={{ width: stampSize, height: stampSize }}
        />
        <Text h4> x [10] = </Text>
        <Text h4>[아메리카노]</Text> */}
        <Button
          title={
            // <Image
            //   source={stampImgChecked}
            //   style={{ width: stampSize, height: stampSize }}
            // />
            '교환권 받기'
          }
          onPress={() => {
            console.log(customerID, storeID);
            this.setState({ modalVisible: true });
          }}
        />
        <RewardsBadge rewards={rewards} />
      </View>
    );
  }
}
