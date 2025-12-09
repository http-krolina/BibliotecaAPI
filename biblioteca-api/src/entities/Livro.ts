import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("livros")
export class Livro {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 255 })
  titulo!: string;

  @Column({ type: "varchar", length: 255 })
  autor!: string;

  @Column({ type: "varchar", length: 13, unique: true })
  isbn!: string;

  @Column({ name: "ano_publicacao", type: "int" })
  anoPublicacao!: number;

  @Column({ type: "boolean", default: true })
  disponivel!: boolean;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;

  @Column({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
  })
  updatedAt!: Date;
}
