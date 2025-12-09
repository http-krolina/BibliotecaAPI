import { Router } from "express";
import { LivroController } from "../controllers/livro.controller";

const router = Router();
const livroController = new LivroController();

// CREATE
router.post("/livros", (req, res) => livroController.criarLivro(req, res));

// READ ALL
router.get("/livros", (req, res) => livroController.listarLivros(req, res));

// READ ONE
router.get("/livros/:id", (req, res) =>
  livroController.obterLivroPorId(req, res)
);

// UPDATE
router.put("/livros/:id", (req, res) =>
  livroController.atualizarLivro(req, res)
);

// DELETE
router.delete("/livros/:id", (req, res) =>
  livroController.deletarLivro(req, res)
);

export default router;
