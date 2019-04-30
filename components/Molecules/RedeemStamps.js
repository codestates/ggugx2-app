import React, { Component } from 'react';
import { View, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import { Text, Button, Overlay } from 'react-native-elements';
import RewardsBadge from '../Atoms/RewardsBadge';
import axios from '../../modules/axios-connector';
import socket from '../../modules/socket-connector';

// TODO: modal 열고닫히는것 간결하게 컨트롤하도록 state 정리하고 setState도 정리하기
export default class RedeemStamps extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      modalVisibleUse: false,
      modalVisibleError: false,
      isComplete: false,
      stage: 0,
      status: '교환이 완료됐습니다!'
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

      if (msg) {
        this.setState({
          modalVisibleUse: true,
          isComplete: true
        });
        props.onUpdateCounts(msg.stamps, msg.rewards);
      }
    });
    socket.on('errors', msg => {
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
    // const stampImgChecked = require('../../assets/images/stamp-checked.png');
    // const stampSize = 50;
    const loadingImg = require('../../assets/images/loadingfriends.gif');
    return (
      <View
        style={{
          flexDirection: 'column',
          // flexWrap: 'nowrap',
          alignItems: 'center',
          justifyContent: 'center',
          alignSelf: 'center',
          // paddingHorizontal: 40,
          width: '90%',
          borderWidth: 0
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
          overlayStyle={{
            borderWidth: 1,
            borderColor: 'lightgray',
            borderRadius: 10
          }}
        >
          {stage === 0 ? (
            <View
              style={{
                height: '90%',
                flexDirection: 'column',
                alignItems: 'stretch',
                justifyContent: 'space-around'
              }}
            >
              <Text style={{ fontSize: 22, textAlign: 'center' }}>
                스탬프 10개를 교환권 1개로{'\n'}교환하시겠습니까?
              </Text>
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

                    const { stamps, rewards } = response.data;
                    onUpdateCounts(stamps, rewards);
                    this.setState({
                      isComplete: true
                    });
                  } catch (error) {
                    this.setState({
                      isComplete: true,
                      status: ' 실패!\n교환권이 부족합니다.'
                    });
                  }
                }}
              />
              <Button
                title={'취소'}
                containerStyle={{ height: 30 }}
                buttonStyle={{ height: 40, backgroundColor: 'lightgray' }}
                onPress={() => {
                  this.setState({ modalVisible: false, isComplete: false });
                }}
              />
            </View>
          ) : !isComplete ? (
            <View
              style={{
                height: '90%',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'space-around'
              }}
            >
              {/* <ActivityIndicator /> */}
              <Image source={loadingImg} style={{ width: 70, height: 70 }} />
              <Text style={{ fontSize: 22, textAlign: 'center' }}>
                교환중..
              </Text>
            </View>
          ) : (
            <View
              style={{
                height: '90%',
                flexDirection: 'column',
                alignItems: 'stretch',
                justifyContent: 'space-around'
              }}
            >
              <Text style={{ fontSize: 20, textAlign: 'center' }}>
                {status}
              </Text>
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
          overlayStyle={{
            borderWidth: 1,
            borderColor: 'lightgray',
            borderRadius: 10
          }}
        >
          {stage === 0 ? (
            <View
              style={{
                height: '90%',
                flexDirection: 'column',
                alignItems: 'stretch',
                justifyContent: 'space-around'
              }}
            >
              <Text style={{ fontSize: 22, textAlign: 'center' }}>
                교환권을 1장{'\n'}사용하시겠습니까?
              </Text>
              <Button
                title={'사용합시다!'}
                onPress={() => {
                  this.setState({
                    stage: 1
                  });

                  socket.emit('reward use from user', {
                    store: this.props.storeID
                  });
                }}
              />
              <Button
                title={'취소'}
                containerStyle={{ height: 30 }}
                buttonStyle={{ height: 40, backgroundColor: 'lightgray' }}
                onPress={() => {
                  this.setState({ modalVisibleUse: false, isComplete: false });
                }}
              />
            </View>
          ) : !isComplete ? (
            <View
              style={{
                height: '90%',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'space-around',
                paddingTop: 10
              }}
            >
              {/* <ActivityIndicator /> */}
              <Image source={loadingImg} style={{ width: 70, height: 70 }} />
              <Text style={{ fontSize: 22, textAlign: 'center' }}>
                사장님의 확인을{'\n'}기다리는 중입니다.
              </Text>
            </View>
          ) : (
            <View
              style={{
                height: '90%',
                flexDirection: 'column',
                alignItems: 'stretch',
                justifyContent: 'space-around'
              }}
            >
              <Text style={{ fontSize: 22, textAlign: 'center' }}>
                교환권을 사용했습니다!
              </Text>
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

        <View
          style={{
            width: '100%',
            flexDirection: 'column',
            alignItems: 'stretch',
            // justifyContent: 'space-between',
            borderWidth: 0
          }}
        >
          {/* <Text style={{ fontSize: 20, fontWeight: 'bold', width: 55 }}>
            교환권
          </Text> */}
          <Button
            title={'교환권 받기'}
            onPress={() => {
              if (stamps < 10) {
                alert('스탬프가 부족합니다');
                return;
              }
              this.setState({ modalVisible: true });
            }}
            containerStyle={{ marginTop: 5 }}
            buttonStyle={{ borderRadius: 100 }}
            titleStyle={{ fontSize: 20 }}
          />
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              // width: 140,
              height: 50,
              borderRadius: 100,
              backgroundColor: 'rgb(255, 205, 55)',
              justifyContent: 'center',
              marginVertical: 1,
              paddingLeft: 10
            }}
            onPress={() => {
              if (rewards === 0) {
                alert('교환권이 없습니다');
                return;
              }
              this.setState({ modalVisibleUse: true });
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
              교환권 사용하기
            </Text>
            <RewardsBadge rewards={rewards} storeID={storeID} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
