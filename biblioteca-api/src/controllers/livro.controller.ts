import { Request, Response } from "express";
import { LivroRepository } from "../repositories/livro.repository";

export class LivroController {
  private livroRepository = new LivroRepository();

  // CREATE - POST /api/livros
  async criarLivro(req: Request, res: Response): Promise<void> {
    try {
      // Validações
      const { titulo, autor, isbn, anoPublicacao, disponivel } = req.body;

      if (!titulo || !autor || !isbn || !anoPublicacao) {
        res.status(400).json({
          message: "Todos os campos obrigatórios devem ser preenchidos",
          required: ["titulo", "autor", "isbn", "anoPublicacao"],
        });
        return;
      }

      if (typeof anoPublicacao !== "number" || anoPublicacao < 0) {
        res.status(400).json({
          message: "Ano de publicação deve ser um número positivo",
        });
        return;
      }

      // Verificar se ISBN já existe
      const livroExistente = await this.livroRepository.findByISBN(isbn);
      if (livroExistente) {
        res.status(409).json({
          message: "ISBN já cadastrado no sistema",
        });
        return;
      }

      const livro = await this.livroRepository.create({
        titulo,
        autor,
        isbn,
        anoPublicacao,
        disponivel: disponivel !== undefined ? disponivel : true,
      });

      res.status(201).json({
        message: "Livro criado com sucesso",
        livro,
      });
    } catch (error) {
      console.error("Erro ao criar livro:", error);
      res.status(500).json({
        message: "Erro interno do servidor",
      });
    }
  }

  // READ ALL - GET /api/livros
  async listarLivros(req: Request, res: Response): Promise<void> {
    try {
      const livros = await this.livroRepository.findAll();
      res.status(200).json(livros);
    } catch (error) {
      console.error("Erro ao listar livros:", error);
      res.status(500).json({
        message: "Erro interno do servidor",
      });
    }
  }

  // READ ONE - GET /api/livros/{id}
  async obterLivroPorId(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        res.status(400).json({
          message: "ID deve ser um número válido",
        });
        return;
      }

      const livro = await this.livroRepository.findById(id);

      if (!livro) {
        res.status(404).json({
          message: "Livro não encontrado",
        });
        return;
      }

      res.status(200).json(livro);
    } catch (error) {
      console.error("Erro ao obter livro:", error);
      res.status(500).json({
        message: "Erro interno do servidor",
      });
    }
  }

  // UPDATE - PUT /api/livros/{id}
  async atualizarLivro(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        res.status(400).json({
          message: "ID deve ser um número válido",
        });
        return;
      }

      const { titulo, autor, isbn, anoPublicacao, disponivel } = req.body;

      // Validações
      if (
        anoPublicacao !== undefined &&
        (typeof anoPublicacao !== "number" || anoPublicacao < 0)
      ) {
        res.status(400).json({
          message: "Ano de publicação deve ser um número positivo",
        });
        return;
      }

      // Verificar se livro existe
      const livroExistente = await this.livroRepository.findById(id);
      if (!livroExistente) {
        res.status(404).json({
          message: "Livro não encontrado",
        });
        return;
      }

      // Verificar se ISBN já existe (caso esteja sendo alterado)
      if (isbn && isbn !== livroExistente.isbn) {
        const livroComISBN = await this.livroRepository.findByISBN(isbn);
        if (livroComISBN) {
          res.status(409).json({
            message: "ISBN já cadastrado para outro livro",
          });
          return;
        }
      }

      const livroAtualizado = await this.livroRepository.update(id, {
        titulo,
        autor,
        isbn,
        anoPublicacao,
        disponivel,
      });

      res.status(200).json({
        message: "Livro atualizado com sucesso",
        livro: livroAtualizado,
      });
    } catch (error) {
      console.error("Erro ao atualizar livro:", error);
      res.status(500).json({
        message: "Erro interno do servidor",
      });
    }
  }

  // DELETE - DELETE /api/livros/{id}
  async deletarLivro(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        res.status(400).json({
          message: "ID deve ser um número válido",
        });
        return;
      }

      // Verificar se livro existe
      const livroExistente = await this.livroRepository.findById(id);
      if (!livroExistente) {
        res.status(404).json({
          message: "Livro não encontrado",
        });
        return;
      }

      const deletado = await this.livroRepository.delete(id);

      if (deletado) {
        res.status(200).json({
          message: "Livro deletado com sucesso",
        });
      } else {
        res.status(500).json({
          message: "Erro ao deletar livro",
        });
      }
    } catch (error) {
      console.error("Erro ao deletar livro:", error);
      res.status(500).json({
        message: "Erro interno do servidor",
      });
    }
  }
}
