import express from "express";
import cors from "cors";
import "express-async-errors";
import { router } from "./routes";

const app = express();

app.use(cors());
app.use(express.json());
app.use(router);

// ====================== CONFIGURAÇÃO ======================
const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
  console.log(`Servidor ligado!!!!!!!!!!!!!!! na porta ${PORT}`);
});
