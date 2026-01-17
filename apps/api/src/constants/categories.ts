export const CATEGORIAS = [
  "promocoes",
  "bolsas_pochetes",
  "chapeus_bones_viseiras",
  "vestuario",
  "acessorios_brinquedos_infantil",
  "mais_vendidos",
  "lar_casa",
] as const;

export type CategoriaProduto = (typeof CATEGORIAS)[number];

export function isCategoriaValida(value: unknown): value is CategoriaProduto {
  return typeof value === "string" && (CATEGORIAS as readonly string[]).includes(value);
}
