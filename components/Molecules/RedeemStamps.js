import React, { Component } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Text, Image, Button, Overlay } from 'react-native-elements';
import RewardsBadge from '../Atoms/RewardsBadge';
import axios from '../../modules/axios-connector';
import socket from '../../modules/socket-connector';

export default class RedeemStamps extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      modalVisibleUse: false,
      modalVisibleError: false,
      isComplete: false,
      stage: 0,
      status: '완료!'
      // rewards: this.props.rewards
    };

    socket.on('reward use complete', msg => {
      // socket.io 'reward use complete' 이벤트에 실려오는 오브젝트
      // let resultObj = {
      //   store: storeID,
      //   customer: customerID,
      //   stamps: stampsData.length,
      //   rewards: rewardsData.length
      // };
      console.log('교환권 사용 이벤트 수신!!!!!', msg);
      if (msg) {
        console.log(
          `[reward use complete] ${msg.customer} 고객님! ${
            msg.store
          } 에서 reward 사용이 완료되었습니다.`,
          msg
        );
        this.setState({
          modalVisibleUse: true,
          isComplete: true
        });
        props.onUpdateCounts(msg.stamps, msg.rewards);
      }
    });
    socket.on('errors', msg => {
      console.log(`RedeemStamps] [socket.io error] ${msg.message}`);
      this.setState({
        modalVisible: false,
        modalVisibleUse: false,
        modalVisibleError: true,
        status: msg.message
      });
    });
  }

  render() {
    const { customerID, storeID, onUpdateCounts, stamps, rewards } = this.props;
    const {
      modalVisible,
      modalVisibleUse,
      modalVisibleError,
      isComplete,
      stage,
      status
    } = this.state;
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
          isVisible={modalVisibleError}
          width={'80%'}
          height={200}
          onBackdropPress={() => {
            this.setState({
              modalVisible: false,
              modalVisibleError: false,
              modalVisibleUse: false,
              isComplete: false
            });
          }}
        >
          <Text>에러 발생! {status}</Text>
        </Overlay>

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
                onPress={async () => {
                  this.setState({ stage: 1 });
                  const uri = '/customers/exchange';
                  try {
                    const response = await axios.post(uri, {
                      customerID,
                      storeID
                    });
                    console.log(`${uri} 성공`, response.data);
                    const { stamps, rewards } = response.data;
                    onUpdateCounts(stamps, rewards);
                    this.setState({
                      isComplete: true
                    });
                  } catch (error) {
                    console.log(`${uri} 실패`, error);
                    console.log('message: ', error.response.data.message);
                    this.setState({
                      isComplete: true,
                      status: '실패!' + error.response.data.message
                    });
                  }
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
                  this.setState({
                    modalVisible: false,
                    isComplete: false,
                    stage: 0
                  });
                }}
              />
            </View>
          )}
        </Overlay>
        {/* /// 교환권 사용하기 modal /// */}
        <Overlay
          isVisible={modalVisibleUse}
          width={'80%'}
          height={200}
          onBackdropPress={() => {
            isComplete &&
              this.setState({ modalVisibleUse: false, isComplete: false });
          }}
        >
          {stage === 0 ? (
            <View>
              <Text>교환권을 1장 사용하시겠습니까?</Text>
              <Button
                title={'사용합시다!'}
                onPress={() => {
                  this.setState({
                    stage: 1
                  });
                  console.log(
                    '교환권 사용 이벤트 emit!!!!',
                    this.props.storeID
                  );
                  socket.emit('reward use from user', {
                    store: this.props.storeID
                  });
                }}
              />
            </View>
          ) : !isComplete ? (
            <View>
              <Text>교환권 사용을 요청했습니다!</Text>
              <ActivityIndicator />
              <Text>사장님의 확인을 기다리는 중입니다.</Text>
            </View>
          ) : (
            <View>
              <Text>교환권을 사용했습니다!</Text>
              <Button
                title={'닫기'}
                onPress={() => {
                  this.setState({
                    modalVisibleUse: false,
                    isComplete: true,
                    stage: 0
                  });
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
            '교환하기'
          }
          onPress={() => {
            console.log(`손님:${customerID}, 가게:${storeID}`);
            if (stamps === 0) {
              alert('스탬프가 없슴');
              return;
            }
            this.setState({ modalVisible: true });
          }}
        />
        <RewardsBadge
          rewards={rewards}
          storeID={storeID}
          onPress={() => {
            if (rewards === 0) {
              alert('교환권이 없슴');
              return;
            }
            this.setState({ modalVisibleUse: true });
          }}
        />
      </View>
    );
  }
}
