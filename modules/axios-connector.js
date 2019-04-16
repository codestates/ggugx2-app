import axios from 'axios';

axios.defaults.baseURL =
  'http://ec2-13-115-51-251.ap-northeast-1.compute.amazonaws.com:3000';
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.timeout = 3000;

export default axios;
