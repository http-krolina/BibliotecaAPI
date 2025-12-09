import "reflect-metadata";
import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import { AppDataSource } from "./database/data-source";
import livroRoutes from "./routes/livro.routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rota de saúde
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "API da Biblioteca está funcionando",
    timestamp: new Date().toISOString(),
  });
});

// Rotas da API
app.use("/api", livroRoutes);

// Rota não encontrada
app.use("*", (req, res) => {
  res.status(404).json({
    message: "Rota não encontrada",
  });
});

// Inicialização do servidor
AppDataSource.initialize()
  .then(() => {
    console.log("✅ Banco de dados conectado com sucesso!");

    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
      console.log(`📚 API disponível em: http://localhost:${PORT}/api/livros`);
    });
  })
  .catch((error) => {
    console.error("❌ Erro ao conectar ao banco de dados:", error);
    process.exit(1);
  });

export default app;
