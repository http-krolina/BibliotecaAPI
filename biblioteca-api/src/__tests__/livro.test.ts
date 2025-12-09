import request from "supertest";
import app from "../app";

describe("Livros API", () => {
  it("GET /livros deve retornar array vazio inicialmente", async () => {
    const res = await request(app).get("/livros");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(0);
  });

  it("POST /livros deve criar um livro", async () => {
    const novo = {
      titulo: "Dom Casmurro",
      autor: "Machado de Assis",
      ano: 1899,
    };
    const res = await request(app).post("/livros").send(novo);
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject(novo);
    expect(res.body).toHaveProperty("id");
  });
});
