import { useEffect, useState } from "react";
import { getProducts } from "../api/products";
import type { Product } from "../api/products";
import { ProductCard } from "../components/ProductCard";
import {
  CATEGORIAS_ORDEM,
  CATEGORIA_LABEL,
  type CategoriaProduto,
} from "../constants/categories";

export function Catalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch(() =>
        setError("Não foi possível carregar os produtos. Verifique se a API está rodando.")
      )
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p style={{ padding: 24 }}>Carregando produtos...</p>;
  if (error) return <p style={{ padding: 24, color: "crimson" }}>{error}</p>;

  const grouped = products.reduce<Record<CategoriaProduto, Product[]>>((acc, p) => {
    const key = p.categoria as CategoriaProduto;
    acc[key] = acc[key] ?? [];
    acc[key].push(p);
    return acc;
  }, {} as Record<CategoriaProduto, Product[]>);

  return (
    <div style={{ padding: 24, maxWidth: 1100, margin: "0 auto" }}>
      <h1>Catálogo de Atacado</h1>

      {CATEGORIAS_ORDEM.map((categoria) => {
        const items = grouped[categoria] ?? [];

        if (items.length === 0) return null;

        return (
          <section key={categoria} style={{ marginTop: 24 }}>
            <h2 style={{ marginBottom: 12 }}>{CATEGORIA_LABEL[categoria]}</h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                gap: 16,
              }}
            >
              {items.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
