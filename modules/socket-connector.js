import io from 'socket.io-client';

var socket = io(
  'http://ec2-13-115-51-251.ap-northeast-1.compute.amazonaws.com:3000'
  // 'http://localhost:3000'
);

export default socket;
