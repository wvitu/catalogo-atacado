import { Router } from "express";
import { upload } from "../middlewares/upload";
import { supabase } from "../lib/supabase";

import {
  listPublicProducts,
  createProduct,
  patchProduct,
  setAtivo,
  deleteProduct,
} from "../controllers/products.controller";

export const productsRouter = Router();

productsRouter.get("/products", listPublicProducts);
productsRouter.post("/products", createProduct);
productsRouter.patch("/products/:id", patchProduct);

// manter só UMA rota de ativo (remover /hide pra não duplicar)
productsRouter.patch("/products/:id/ativo", setAtivo);

productsRouter.delete("/products/:id", deleteProduct);

// upload de imagem (fica aqui por ser “products”, mas poderia virar controller também)
productsRouter.post("/products/:id/image", upload.single("image"), async (req, res) => {
  const { id } = req.params;

  if (!req.file) return res.status(400).json({ message: "Envie um arquivo no campo 'image'." });

  const allowed = ["image/jpeg", "image/png", "image/webp"];
  if (!allowed.includes(req.file.mimetype)) {
    return res.status(400).json({ message: "Formato inválido. Use JPEG, PNG ou WEBP." });
  }

  const ext =
    req.file.mimetype === "image/png" ? "png" : req.file.mimetype === "image/webp" ? "webp" : "jpg";

  const filePath = `products/${id}.${ext}`;

  const { error: uploadError } = await supabase.storage.from("product-images").upload(filePath, req.file.buffer, {
    contentType: req.file.mimetype,
    upsert: true,
  });

  if (uploadError) return res.status(500).json({ message: uploadError.message });

  const { data: publicData } = supabase.storage.from("product-images").getPublicUrl(filePath);
  const publicUrl = publicData.publicUrl;

  const { data, error } = await supabase
    .from("products")
    .update({ foto_url: publicUrl })
    .eq("id", id)
    .select("*")
    .single();

  if (error) return res.status(500).json({ message: error.message });

  return res.json({ message: "Imagem enviada com sucesso.", product: data });
});
