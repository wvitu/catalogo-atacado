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

export const CATEGORIA_LABEL: Record<CategoriaProduto, string> = {
  promocoes: "Promoções",
  bolsas_pochetes: "Bolsas e Pochetes",
  chapeus_bones_viseiras: "Chapéus, Bonés e Viseiras",
  vestuario: "Vestuário",
  acessorios_brinquedos_infantil: "Acessórios, Brinquedos e Infantil",
  mais_vendidos: "Mais vendidos",
  lar_casa: "Lar e casa",
};
