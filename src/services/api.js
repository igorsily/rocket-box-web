import axios from 'axios';

const api = axios.create({
  baseURL: 'https://rocketbox-server.herokuapp.com/',
});

export default api;
