import axios from 'axios';

const api = axios.create({
  // Coloque aqui o IP e a porta do seu backend
  baseURL: 'http://10.106.152.44:3333' // Exemplo: troque pelo seu IP real
});

export default api;