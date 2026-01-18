import type { Product } from "../api/products";
import { CATEGORIA_LABEL } from "../constants/categories";


type Props = {
  product: Product;
};

export function ProductCard({ product }: Props) {
  return (
    <div style={{ border: "1px solid #ddd", padding: 16, borderRadius: 10 }}>
      {product.foto_url ? (
        <img
          src={product.foto_url}
          alt={product.nome}
          style={{ width: "100%", height: 200, objectFit: "cover", borderRadius: 8 }}
        />
      ) : (
        <div
          style={{
            width: "100%",
            aspectRatio: "1 / 1",
            background: "#f2f2f2",
            borderRadius: 8,
            display: "grid",
            placeItems: "center",
            color: "#777",
          }}
        >
          Sem imagem
        </div>
      )}

      <h3 style={{ margin: "12px 0 6px" }}>{product.nome}</h3>
      <p style={{ margin: 0 }}>Código: {product.codigo}</p>
      <p style={{ margin: "6px 0" }}>
        <strong>R$ {product.preco_atacado.toFixed(2)}</strong>
      </p>
      <small style={{ color: "#666" }}>
  {CATEGORIA_LABEL[product.categoria as keyof typeof CATEGORIA_LABEL] ?? product.categoria}
</small>

    </div>
  );
}


