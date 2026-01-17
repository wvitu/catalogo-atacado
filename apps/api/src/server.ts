import "dotenv/config";

import express from "express";
import cors from "cors";

import { supabase } from "./lib/supabase";
import { isCategoriaValida } from "./constants/categories";

import multer from "multer";


const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
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

app.post(
  "/products/:id/image",
  upload.single("image"),
  async (req, res) => {
    const { id } = req.params;

    if (!req.file) {
      return res.status(400).json({ message: "Envie um arquivo no campo 'image'." });
    }

    // validação simples de tipo (aceita jpeg/png/webp)
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(req.file.mimetype)) {
      return res.status(400).json({ message: "Formato inválido. Use JPEG, PNG ou WEBP." });
    }

    const ext =
      req.file.mimetype === "image/png"
        ? "png"
        : req.file.mimetype === "image/webp"
        ? "webp"
        : "jpg";

    // caminho no bucket (organizado por produto)
    const filePath = `products/${id}.${ext}`;

    // Faz upload no bucket
    const { error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(filePath, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: true, // permite substituir a imagem
      });

    if (uploadError) {
      return res.status(500).json({ message: uploadError.message });
    }

    // Pega URL pública (porque bucket está public)
    const { data: publicData } = supabase.storage
      .from("product-images")
      .getPublicUrl(filePath);

    const publicUrl = publicData.publicUrl;

    // Atualiza produto com foto_url
    const { data, error } = await supabase
      .from("products")
      .update({ foto_url: publicUrl })
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      return res.status(500).json({ message: error.message });
    }

    return res.json({ message: "Imagem enviada com sucesso.", product: data });
  }
);


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

const precoInput = req.body.preco_atacado ?? req.body.precoAtacado;
const precoNumero = Number(precoInput);

if (!Number.isFinite(precoNumero) || precoNumero <= 0) {
  return res.status(400).json({
    message: "Preço de atacado inválido (use número maior que zero).",
  });
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
