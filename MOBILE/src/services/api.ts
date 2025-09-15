import axios from 'axios';

const api = axios.create({
baseURL: 'http://10.97.76.151:3333',
});

 export { api }