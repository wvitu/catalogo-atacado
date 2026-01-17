import "dotenv/config";

import express from "express";
import cors from "cors";

import { supabase } from "./lib/supabase";
import { isCategoriaValida } from "./constants/categories";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/products", async (_req, res) => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return res.status(500).json({ message: error.message });
  }

  return res.json(data);
});

app.post("/products", async (req, res) => {
  const { nome, codigo, precoAtacado, fotoUrl, categoria } = req.body;

  // Validação: nome
  if (!nome || typeof nome !== "string" || nome.trim().length < 3) {
    return res.status(400).json({ message: "Nome inválido (mínimo 3 caracteres)." });
  }

  // Validação: código
  if (!codigo || typeof codigo !== "string" || codigo.trim().length < 2) {
    return res.status(400).json({ message: "Código inválido (mínimo 2 caracteres)." });
  }

  // Validação: preço
  const precoNumero = Number(precoAtacado);
  if (Number.isNaN(precoNumero) || precoNumero < 0) {
    return res.status(400).json({ message: "Preço de atacado inválido (use número >= 0)." });
  }

  // Validação: categoria obrigatória e controlada
  if (!isCategoriaValida(categoria)) {
    return res.status(400).json({
      message:
        "Categoria inválida. Use: promocoes, bolsas_pochetes, chapeus_bones_viseiras, vestuario, acessorios_brinquedos_infantil, mais_vendidos, lar_casa",
    });
  }

  // Payload no formato do banco (snake_case)
  const payload = {
    nome: nome.trim(),
    codigo: codigo.trim(),
    preco_atacado: precoNumero,
    foto_url: fotoUrl ?? null,
    categoria, // já validada
  };

  const { data, error } = await supabase
    .from("products")
    .insert(payload)
    .select("*")
    .single();

  if (error) {
    return res.status(400).json({ message: error.message });
  }

  return res.status(201).json(data);
});

const PORT = process.env.PORT ? Number(process.env.PORT) : 3333;
app.listen(PORT, () => {
  console.log(`API rodando em http://localhost:${PORT}`);
});
