import { Router } from "express";
import { supabase } from "../lib/supabase";

export const settingsRouter = Router();

settingsRouter.get("/settings", async (_req, res) => {
  const { data, error } = await supabase
    .from("app_settings")
    .select("*")
    .eq("id", 1)
    .single();

  if (error) return res.status(500).json({ message: error.message });
  return res.json(data);
});

settingsRouter.patch("/settings", async (req, res) => {
  const { company_name, catalog_name, contact_phone } = req.body as {
    company_name?: string;
    catalog_name?: string;
    contact_phone?: string | null;
  };

  if (company_name !== undefined && (typeof company_name !== "string" || company_name.trim().length < 2)) {
    return res.status(400).json({ message: "Nome da empresa inválido (mínimo 2 caracteres)." });
  }
  if (catalog_name !== undefined && (typeof catalog_name !== "string" || catalog_name.trim().length < 2)) {
    return res.status(400).json({ message: "Nome do catálogo inválido (mínimo 2 caracteres)." });
  }
  if (contact_phone !== undefined && contact_phone !== null && typeof contact_phone !== "string") {
    return res.status(400).json({ message: "Telefone inválido." });
  }

  const payload: any = { updated_at: new Date().toISOString() };
  if (company_name !== undefined) payload.company_name = company_name.trim();
  if (catalog_name !== undefined) payload.catalog_name = catalog_name.trim();
  if (contact_phone !== undefined) payload.contact_phone = contact_phone?.trim() || null;

  const { data, error } = await supabase
    .from("app_settings")
    .update(payload)
    .eq("id", 1)
    .select("*")
    .single();

  if (error) return res.status(500).json({ message: error.message });
  return res.json(data);
});
