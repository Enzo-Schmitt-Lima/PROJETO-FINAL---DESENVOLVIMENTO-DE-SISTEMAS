import { io, Socket } from "socket.io-client";
import api from "./api";

let socket: Socket | null = null;

export function connectSocket() {
  if (socket) return socket;

  // api.baseURL não está exposto, então reconstruímos a URL usando a mesma lógica (baseURL do axios)
  // aqui assumimos que o backend está na mesma host com porta 3333
  const base = (api.defaults.baseURL || "http://10.0.2.2:3333").replace(/:\d+$/, ":3333");
  socket = io(base, {
    transports: ["websocket"],
  });

  socket.on("connect", () => console.log("Socket conectado: ", socket?.id));
  socket.on("disconnect", () => console.log("Socket desconectado"));

  return socket;
}

export function getSocket() {
  if (!socket) return connectSocket();
  return socket;
}
