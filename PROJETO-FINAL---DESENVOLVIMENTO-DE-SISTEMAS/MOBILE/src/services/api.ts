import axios from 'axios';

const api = axios.create({
   baseURL: // 'http://10.106.131.58:3333' 
  'http://192.168.0.243:3333'  
  // 10.0.2.2 é o IP padrão para acessar o localhost do computador a partir do emulador Android
  // Se estiver usando um dispositivo físico, substitua pelo IP da sua máquina na rede local (CMD, ipconfig, IPv4)
  // marcha e boa
});

export default api;