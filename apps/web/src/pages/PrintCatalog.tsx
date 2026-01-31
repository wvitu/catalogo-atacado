import { useEffect, useMemo, useState } from "react";
import { getProducts, type Product } from "../api/products";
import { CATEGORIAS_ORDEM, CATEGORIA_LABEL, type CategoriaProduto } from "../constants/categories";
import { useSettings } from "../contexts/SettingsContext";
import "./PrintCatalog.css";

export function PrintCatalog() {
  const { settings } = useSettings();

  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ Força fundo branco somente na rota /print
  useEffect(() => {
    document.body.classList.add("print-page");
    return () => {
      document.body.classList.remove("print-page");
    };
  }, []);

  useEffect(() => {
    (async () => {
      try {
        setError(null);
        setLoading(true);
        const data = await getProducts(); // já vem só ativo pelo endpoint /products
        setItems(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Erro ao carregar produtos");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const grouped = useMemo(() => {
    return items.reduce<Record<CategoriaProduto, Product[]>>((acc, p) => {
      const cat = (p.categoria as CategoriaProduto) ?? "promocoes";
      acc[cat] ??= [];
      acc[cat].push(p);
      return acc;
    }, {} as Record<CategoriaProduto, Product[]>);
  }, [items]);

  const companyName = settings?.company_name ?? "";
  const catalogName = settings?.catalog_name ?? "Catálogo de Atacado";
  const contactPhone = settings?.contact_phone ?? "";

  if (loading) return <div className="print-wrap">Carregando...</div>;
  if (error) return <div className="print-wrap">Erro: {error}</div>;

  return (
    <div className="print-wrap">
      {/* CAPA (1ª página) */}
      <section className="print-cover">
        <div className="print-cover-box">
          <div className="print-cover-title">{catalogName}</div>
          {companyName && <div className="print-cover-company">{companyName}</div>}
          {contactPhone && <div className="print-cover-contact">Contato: {contactPhone}</div>}
        </div>
      </section>

      {/* CATÁLOGO (começa na 2ª página) */}
      {CATEGORIAS_ORDEM.map((cat) => {
        const list = grouped[cat] ?? [];
        if (list.length === 0) return null;

        return (
          <section key={cat} className="print-section">
            <h2 className="print-category-title">{CATEGORIA_LABEL[cat]}</h2>

            <div className="print-grid">
              {list.map((p) => (
                <article key={p.id} className="print-card">
                  <div className="print-img">
                    {p.foto_url ? (
                      <img src={p.foto_url} alt={p.nome} />
                    ) : (
                      <div className="print-img-placeholder">Sem imagem</div>
                    )}
                  </div>

                  <div className="print-body">
                    <div className="print-name">{p.nome}</div>
                    <div className="print-meta">Cód: {p.codigo}</div>
                    <div className="print-meta">
                      Preço: R$ {Number(p.preco_atacado).toFixed(2)}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
