import { useEffect, useMemo, useState } from "react";
import { getProducts, type Product } from "../api/products";
import { CATEGORIAS_ORDEM, CATEGORIA_LABEL, type CategoriaProduto } from "../constants/categories";
import "./PrintCatalog.css";

function chunk<T>(arr: T[], size: number) {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

function categoryIndex(cat?: string | null) {
  const idx = CATEGORIAS_ORDEM.indexOf(cat as CategoriaProduto);
  return idx === -1 ? 999 : idx;
}

function formatBRL(n: number) {
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function PrintCard({ p }: { p: Product }) {
  const catKey = p.categoria as CategoriaProduto;

  return (
    <div className="pcard">
      <div className="pcard-imgWrap">
        {p.foto_url ? (
          <img className="pcard-img" src={p.foto_url} alt={p.nome} />
        ) : (
          <div className="pcard-noimg">Sem foto</div>
        )}
      </div>

      <div className="pcard-body">
        <div className="pcard-name" title={p.nome}>{p.nome}</div>
        <div className="pcard-meta">
          <span><strong>Cód:</strong> {p.codigo}</span>
          <span><strong>Preço:</strong> {formatBRL(Number(p.preco_atacado || 0))}</span>
        </div>
        <div className="pcard-cat">
          {CATEGORIA_LABEL[catKey] ?? p.categoria ?? ""}
        </div>
      </div>
    </div>
  );
}

export function PrintCatalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch(() => setError("Não foi possível carregar os produtos. Verifique se a API está rodando."))
      .finally(() => setLoading(false));
  }, []);

  const ordered = useMemo(() => {
    // ordena por categoria (na ordem definida) e depois por nome
    return [...products].sort((a, b) => {
      const ia = categoryIndex(a.categoria);
      const ib = categoryIndex(b.categoria);
      if (ia !== ib) return ia - ib;
      return String(a.nome ?? "").localeCompare(String(b.nome ?? ""), "pt-BR");
    });
  }, [products]);

  const pages = useMemo(() => chunk(ordered, 20), [ordered]);

  if (loading) return <p style={{ padding: 24 }}>Carregando para impressão...</p>;
  if (error) return <p style={{ padding: 24, color: "crimson" }}>{error}</p>;

  const today = new Date().toLocaleString("pt-BR");

  return (
    <div className="print-root">
      {/* barra (não imprime) */}
      <div className="print-toolbar">
        <button onClick={() => history.back()}>Voltar</button>
        <button onClick={() => window.print()}>Imprimir / Salvar PDF</button>
      </div>

      {pages.map((page, pageIndex) => (
        <div className="print-page" key={pageIndex}>
          <div className="print-header">
            <div>
              <h1>Catálogo de Atacado</h1>
              <div className="print-sub">Gerado em: {today}</div>
            </div>
            <div className="print-pageNum">Página {pageIndex + 1} / {pages.length}</div>
          </div>

          <div className="print-grid">
            {page.map((p) => (
              <PrintCard key={p.id} p={p} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
