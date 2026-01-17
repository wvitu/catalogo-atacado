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
  if (!response.ok) throw new Error("Erro ao buscar produtos");
  return response.json();
}

export type CreateProductInput = {
  nome: string;
  codigo: string;
  preco_atacado: number;
  categoria: string;
};

export async function createProduct(input: CreateProductInput): Promise<Product> {
  const response = await fetch(`${API_URL}/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.message ?? `Erro ao criar produto (HTTP ${response.status})`);
  }

  return response.json();
}

export async function uploadProductImage(productId: string, file: File): Promise<Product> {
  const form = new FormData();
  form.append("image", file);

  const response = await fetch(`${API_URL}/products/${productId}/image`, {
    method: "POST",
    body: form,
  });

  if (!response.ok) {
    const err = await response.json().catch(() => null);
    throw new Error(err?.message ?? "Erro ao enviar imagem");
  }

  // nosso backend retorna { message, product }
  const data = await response.json();
  return data.product as Product;
}
