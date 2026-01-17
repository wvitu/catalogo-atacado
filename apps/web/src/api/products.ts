export type Product = {
  id: string;
  nome: string;
  codigo: string;
  preco_atacado: number;
  foto_url: string | null;
  categoria: string;
  ativo?: boolean;
};

const API_URL = "http://localhost:3333";

export async function getProducts(): Promise<Product[]> {
  const response = await fetch(`${API_URL}/products`);

  if (!response.ok) {
    throw new Error("Erro ao buscar produtos");
  }

  return response.json();
}


