import express from "express";
import cors from "cors";
import "express-async-errors";
import path from "path";
import http from "http";
import { router } from "./routes";
import { initSocket } from "./libs/socket";

const app = express();

app.use(cors());
app.use(express.json());

// Request logger para depuração: mostra todas as requisições recebidas
app.use((req, res, next) => {
  console.log(`--> ${new Date().toISOString()} ${req.method} ${req.url} Authorization: ${req.headers.authorization}`);
  next();
});

// Servir arquivos estáticos da pasta tmp
app.use('/files', express.static(path.resolve(__dirname, '..', 'tmp')));
app.use(router);

// ====================== CONFIGURAÇÃO ======================
const PORT = process.env.PORT || 3333;

const server = http.createServer(app);

// Inicializa o Socket.IO
initSocket(server);

server.listen(PORT, () => {
  console.log(`Servidor ligado!!!!!!!!!!!!!!! na porta ${PORT}`);
});
