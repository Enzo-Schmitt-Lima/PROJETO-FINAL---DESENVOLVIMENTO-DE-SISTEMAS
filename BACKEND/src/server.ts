import express from "express";
import cors from "cors";
import "express-async-errors";
import path from "path";
import { router } from "./routes";

const app = express();

app.use(cors());
app.use(express.json());

// Servir arquivos estáticos da pasta tmp
app.use('/files', express.static(path.resolve(__dirname, '..', 'tmp')));
app.use(router);
console.log("URL do Banco de Dados Carregada:", process.env.DATABASE_URL);

// ====================== CONFIGURAÇÃO ======================
const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
  console.log(`Servidor ligado!!!!!!!!!!!!!!! na porta ${PORT}`);
});
