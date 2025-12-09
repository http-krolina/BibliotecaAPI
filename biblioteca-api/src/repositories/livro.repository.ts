import { AppDataSource } from "../database/data-source";
import { Livro } from "../entities/Livro";

export class LivroRepository {
  private livroRepository = AppDataSource.getRepository(Livro);

  async create(livroData: Partial<Livro>): Promise<Livro> {
    const livro = this.livroRepository.create(livroData);
    return await this.livroRepository.save(livro);
  }

  async findAll(): Promise<Livro[]> {
    return await this.livroRepository.find();
  }

  async findById(id: number): Promise<Livro | null> {
    return await this.livroRepository.findOneBy({ id });
  }

  async update(id: number, livroData: Partial<Livro>): Promise<Livro | null> {
    const livro = await this.findById(id);
    if (!livro) return null;

    Object.assign(livro, livroData);
    livro.updatedAt = new Date();
    return await this.livroRepository.save(livro);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.livroRepository.delete(id);
    return result.affected !== 0;
  }

  async findByISBN(isbn: string): Promise<Livro | null> {
    return await this.livroRepository.findOneBy({ isbn });
  }
}
