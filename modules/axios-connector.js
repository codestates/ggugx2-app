import axios from 'axios';

axios.defaults.baseURL =
  'http://ec2-13-115-51-251.ap-northeast-1.compute.amazonaws.com:3000';
// axios.defaults.headers.common['Authorization'] =
//   'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InN5b2giLCJpYXQiOjE1NTUxMjAxNjcsImV4cCI6MTU1NTEyMzc2N30.ori91r9nDdw6jcNYGrottOTQ8x8EXN23fbDmM0oJU4I';
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.timeout = 3000;

export default axios;
