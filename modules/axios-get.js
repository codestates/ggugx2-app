import axios from './axios-connector';

export default (axiosGet = uri => {
  // axios.defaults.baseURL = 'http://localhost:3000';
  return axios
    .get(uri)
    .then(response => {
      axios.defaults.baseURL =
        'http://ec2-13-115-51-251.ap-northeast-1.compute.amazonaws.com:3000';
      return response.data;
    })
    .catch(error => {
      return error;
    });
});
