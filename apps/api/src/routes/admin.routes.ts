import { Router } from "express";
import { supabase } from "../lib/supabase";

export const adminRouter = Router();

adminRouter.get("/admin/products", async (_req, res) => {
  const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false });
  if (error) return res.status(500).json({ message: error.message });
  return res.json(data);
});
