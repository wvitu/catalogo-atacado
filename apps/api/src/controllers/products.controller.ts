import { supabase } from "../lib/supabase";
import { validateCreateProduct, validatePatchProduct } from "../validators/product.validator";

export async function listPublicProducts(_req: any, res: any) {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("ativo", true)
    .order("created_at", { ascending: false });

  if (error) return res.status(500).json({ message: error.message });
  return res.json(data);
}

export async function createProduct(req: any, res: any) {
  const { nome, codigo, fotoUrl, categoria } = req.body;

  const validation = validateCreateProduct(req.body);
  if (!validation.ok) return res.status(400).json({ message: validation.message });

  const payload = {
    nome: nome.trim(),
    codigo: codigo.trim(),
    preco_atacado: validation.precoNumero,
    foto_url: fotoUrl ?? null,
    categoria,
  };

  const { data, error } = await supabase.from("products").insert(payload).select("*").single();

  if (error) return res.status(400).json({ message: error.message });
  return res.status(201).json(data);
}

export async function patchProduct(req: any, res: any) {
  const { id } = req.params;

  const validation = validatePatchProduct(req.body);
  if (!validation.ok) return res.status(400).json({ message: validation.message });

  const { nome, codigo, categoria, foto_url } = req.body;

  const updatePayload: any = {};
  if (nome !== undefined) updatePayload.nome = nome.trim();
  if (codigo !== undefined) updatePayload.codigo = codigo.trim();
  if (validation.precoNumero !== undefined) updatePayload.preco_atacado = validation.precoNumero;
  if (categoria !== undefined) updatePayload.categoria = categoria;
  if (foto_url !== undefined) updatePayload.foto_url = foto_url;

  const { data, error } = await supabase
    .from("products")
    .update(updatePayload)
    .eq("id", id)
    .select("*")
    .single();

  if (error) return res.status(500).json({ message: error.message });
  return res.json(data);
}

export async function setAtivo(req: any, res: any) {
  const { id } = req.params;
  const { ativo } = req.body as { ativo: boolean };

  if (typeof ativo !== "boolean") {
    return res.status(400).json({ message: "Campo 'ativo' deve ser boolean." });
  }

  const { data, error } = await supabase
    .from("products")
    .update({ ativo })
    .eq("id", id)
    .select("*")
    .single();

  if (error) return res.status(500).json({ message: error.message });
  return res.json(data);
}

export async function deleteProduct(req: any, res: any) {
  const { id } = req.params;

  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) return res.status(500).json({ message: error.message });

  return res.status(204).send();
}
