import { useMemo, useState } from "react";
import { createProduct, uploadProductImage } from "../api/products";
import { CATEGORIAS_ORDEM, CATEGORIA_LABEL, type CategoriaProduto } from "../constants/categories";

type Props = {
  onCreated?: () => void; // pra voltar pro catálogo depois
};

export function Admin({ onCreated }: Props) {
  const [nome, setNome] = useState("");
  const [codigo, setCodigo] = useState("");
  const [preco, setPreco] = useState("");
  const [categoria, setCategoria] = useState<CategoriaProduto>("promocoes");
  const [image, setImage] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const previewUrl = useMemo(() => {
    if (!image) return null;
    return URL.createObjectURL(image);
  }, [image]);

async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();

  setMsg(null);
  setError(null);

  if (!nome.trim()) return setError("Informe o nome do produto.");
  if (!codigo.trim()) return setError("Informe o código/referência.");
  if (!preco.trim()) return setError("Informe o preço de atacado.");

  const precoLimpo = preco
    .trim()
    .replace(/\s/g, "")
    .replace("R$", "")
    .replace(/\./g, "") // milhar
    .replace(",", "."); // decimal

  const precoNumber = Number(precoLimpo);

  console.log("PREÇO RAW:", preco);
  console.log("PREÇO LIMPO:", precoLimpo);
  console.log("PREÇO NUMBER:", precoNumber);

  if (!Number.isFinite(precoNumber) || precoNumber <= 0) {
    console.log("CAIU NO IF DO PREÇO");
    setError("Preço de atacado inválido (use número > 0).");
    return;
  }

  try {
    setLoading(true);

    const created = await createProduct({
      nome: nome.trim(),
      codigo: codigo.trim(),
      preco_atacado: precoNumber,
      categoria,
    });

    if (image) {
      await uploadProductImage(created.id, image);
    }

    setMsg("Produto cadastrado com sucesso!");
    setNome("");
    setCodigo("");
    setPreco("");
    setCategoria("promocoes");
    setImage(null);

    onCreated?.();
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro inesperado";
    setError(message);
  } finally {
    setLoading(false);
  }
}


  return (
    <div style={{ padding: 24, maxWidth: 800, margin: "0 auto" }}>
      <h1>Cadastro de Produto</h1>
      <p style={{ color: "#666" }}>Cadastre um produto e envie a imagem (opcional).</p>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12, marginTop: 16 }}>
        <label style={{ display: "grid", gap: 6 }}>
          Nome do produto
          <input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex: Chapéu Paris" />
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          Código / Referência
          <input value={codigo} onChange={(e) => setCodigo(e.target.value)} placeholder="Ex: CHP-PARIS-001" />
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          Preço de atacado
          <input
            value={preco}
            onChange={(e) => setPreco(e.target.value)}
            placeholder="Ex: 29,90"
            inputMode="decimal"
          />
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          Categoria
          <select value={categoria} onChange={(e) => setCategoria(e.target.value as CategoriaProduto)}>
            {CATEGORIAS_ORDEM.map((c) => (
              <option key={c} value={c}>
                {CATEGORIA_LABEL[c]}
              </option>
            ))}
          </select>
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          Foto (opcional)
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={(e) => setImage(e.target.files?.[0] ?? null)}
          />
        </label>

        {previewUrl && (
          <div style={{ border: "1px solid #ddd", borderRadius: 10, padding: 12 }}>
            <strong>Pré-visualização:</strong>
            <img
              src={previewUrl}
              alt="Prévia"
              style={{ width: "100%", maxHeight: 280, objectFit: "cover", borderRadius: 8, marginTop: 8 }}
            />
          </div>
        )}

        {error && <p style={{ color: "crimson" }}>{error}</p>}
        {msg && <p style={{ color: "green" }}>{msg}</p>}

        <button disabled={loading} type="submit" style={{ padding: 10 }}>
          {loading ? "Salvando..." : "Cadastrar produto"}
        </button>
      </form>
    </div>
  );
}
