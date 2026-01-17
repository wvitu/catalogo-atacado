const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3333";

export type Product = {
  id: string;
  nome: string;
  codigo: string;
  preco_atacado: number;
  foto_url: string | null;
  categoria: string | null;
  ativo: boolean;
  created_at: string;
  updated_at: string;
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, init);

  // delete 204 não tem body
  if (res.status === 204) return undefined as T;

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const msg = data?.message ?? `Erro HTTP ${res.status}`;
    throw new Error(msg);
  }

  return data as T;
}

export async function getProducts(): Promise<Product[]> {
  return request<Product[]>("/products");
}

export async function getAdminProducts(): Promise<Product[]> {
  return request<Product[]>("/admin/products");
}

export async function createProduct(input: {
  nome: string;
  codigo: string;
  preco_atacado: number;
  categoria: string;
  fotoUrl?: string | null;
}): Promise<Product> {
  return request<Product>("/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
}

export async function updateProduct(
  id: string,
  input: {
    nome?: string;
    codigo?: string;
    preco_atacado?: number;
    categoria?: string;
    foto_url?: string | null;
  }
): Promise<Product> {
  return request<Product>(`/products/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
}

export async function setProductAtivo(id: string, ativo: boolean): Promise<Product> {
  return request<Product>(`/products/${id}/ativo`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ativo }),
  });
}

export async function deleteProduct(id: string): Promise<void> {
  await request<void>(`/products/${id}`, { method: "DELETE" });
}

export async function uploadProductImage(productId: string, file: File): Promise<Product> {
  const form = new FormData();
  form.append("image", file);

  const res = await fetch(`${API_URL}/products/${productId}/image`, {
    method: "POST",
    body: form,
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const msg = data?.message ?? `Erro HTTP ${res.status}`;
    throw new Error(msg);
  }

  return data.product as Product;
}
