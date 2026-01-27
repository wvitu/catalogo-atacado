import { useEffect, useMemo, useState } from "react";
import { getProducts, type Product } from "../api/products";
import { CATEGORIAS_ORDEM, CATEGORIA_LABEL, type CategoriaProduto } from "../constants/categories";
import { useSettings } from "../contexts/SettingsContext";
import "./PrintCatalog.css";

function chunk<T>(arr: T[], size: number) {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

function formatBRL(value: number) {
  // mantém no padrão pt-BR (melhor no PDF)
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function PrintCatalog() {
  const { settings, loading: loadingSettings } = useSettings();

  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setError(null);
        setLoading(true);
        const data = await getProducts(); // usa /products => somente ativos
        setItems(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Erro ao carregar produtos");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Agrupa por categoria (na ordem definida)
  const grouped = useMemo(() => {
    return items.reduce<Record<CategoriaProduto, Product[]>>((acc, p) => {
      const cat = (p.categoria as CategoriaProduto) ?? "promocoes";
      acc[cat] ??= [];
      acc[cat].push(p);
      return acc;
    }, {} as Record<CategoriaProduto, Product[]>);
  }, [items]);

  // Monta páginas: cada página tem 1 categoria + até 20 itens
  const pages = useMemo(() => {
    const out: { categoria: CategoriaProduto; produtos: Product[] }[] = [];

    for (const cat of CATEGORIAS_ORDEM) {
      const list = grouped[cat] ?? [];
      if (list.length === 0) continue;

      const parts = chunk(list, 20);
      for (const part of parts) {
        out.push({ categoria: cat, produtos: part });
      }
    }
    return out;
  }, [grouped]);

  const totalPages = pages.length;


  return (
    <div className="print-shell">
      {/* Barra só para tela (não imprime) */}
      <div className="no-print print-toolbar">
        <div>
          <strong>Gerar PDF</strong>
          <div className="hint">
            Dica: na impressão, desmarque <b>“Cabeçalhos e rodapés”</b> para remover data/URL do navegador.
          </div>
        </div>

        <button onClick={() => window.print()} className="btn">
          Imprimir / Salvar PDF
        </button>
      </div>

      {(loading || loadingSettings) && <p className="no-print">Carregando...</p>}
      {error && <p className="no-print error">{error}</p>}

      {/* Páginas */}
      {pages.map((page, idx) => {
        const pageNumber = idx + 1;
        const companyName = settings?.company_name ?? "Empresa";
        const catalogName = settings?.catalog_name ?? "Catálogo";
        const phone = settings?.contact_phone ?? "";

        return (
          <section key={`${page.categoria}-${idx}`} className="print-page">
            {/* Cabeçalho (todas as páginas) */}
            <header className="page-header">
              <div className="header-left">
                <div className="company-name">{companyName}</div>
                <div className="catalog-name">{catalogName}</div>
              </div>

              <div className="header-right">
                {phone ? (
                  <div className="header-meta">
                    Contato: <b>{phone}</b>
                  </div>
                ) : null}
              </div>
            </header>


            {/* Destaque extra só na primeira página */}
            {idx === 0 && (
              <div className="cover">
                <h1>Catálogo de Atacado</h1>
                <p className="cover-sub">
                  {companyName} • {catalogName}
                </p>
              </div>
            )}

            {/* Título da categoria (agora aparece!) */}
            <h2 className="category-title">{CATEGORIA_LABEL[page.categoria] ?? page.categoria}</h2>

            {/* Grid de produtos (até 20) */}
            <div className="products-grid">
              {page.produtos.map((p) => (
                <article key={p.id} className="product-card">
                  <div className="img-wrap">
                    {p.foto_url ? (
                      <img src={p.foto_url} alt={p.nome} />
                    ) : (
                      <div className="no-img">Sem imagem</div>
                    )}
                  </div>

                  <div className="info">
                    <div className="title">{p.nome}</div>
                    <div className="meta">Cód: {p.codigo}</div>
                    <div className="meta">
                      Preço: <b>{formatBRL(Number(p.preco_atacado ?? 0))}</b>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Rodapé (todas as páginas) */}
            <footer className="page-footer">
              <div className="footer-left">{phone ? `WhatsApp: ${phone}` : ""}</div>
              <div className="footer-right">
                Página {pageNumber} / {totalPages}
              </div>
            </footer>
          </section>
        );
      })}

      {!loading && !error && totalPages === 0 && <p className="no-print">Nenhum produto ativo para imprimir.</p>}
    </div>
  );
}
