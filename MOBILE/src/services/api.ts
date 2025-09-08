import axios from 'axios';

const api = axios.create({
baseURL: 'http://10.106.131.51:3333'
});

 export { api }