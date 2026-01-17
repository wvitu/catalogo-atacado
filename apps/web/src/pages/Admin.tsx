import { useEffect, useMemo, useState } from "react";
import {
  createProduct,
  deleteProduct,
  getAdminProducts,
  setProductAtivo,
  updateProduct,
  uploadProductImage,
  type Product,
} from "../api/products";
import { CATEGORIAS_ORDEM, CATEGORIA_LABEL, type CategoriaProduto } from "../constants/categories";
import { Modal } from "../components/Modal";

type Props = {
  onCreated?: () => void;
};

function parsePreco(preco: string): number | null {
  const precoLimpo = preco
    .trim()
    .replace(/\s/g, "")
    .replace("R$", "")
    .replace(/\./g, "")
    .replace(",", ".");
  const n = Number(precoLimpo);
  if (!Number.isFinite(n) || n <= 0) return null;
  return n;
}

export function Admin({ onCreated }: Props) {
  // ---- CREATE
  const [nome, setNome] = useState("");
  const [codigo, setCodigo] = useState("");
  const [preco, setPreco] = useState("");
  const [categoria, setCategoria] = useState<CategoriaProduto>("promocoes");
  const [image, setImage] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const previewUrl = useMemo(() => (image ? URL.createObjectURL(image) : null), [image]);

  // ---- LIST (ADMIN)
  const [items, setItems] = useState<Product[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [errorList, setErrorList] = useState<string | null>(null);

  async function refreshList() {
    try {
      setErrorList(null);
      setLoadingList(true);
      const data = await getAdminProducts();
      setItems(data);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Erro ao carregar produtos";
      setErrorList(message);
    } finally {
      setLoadingList(false);
    }
  }

  useEffect(() => {
    refreshList();
  }, []);

  // ---- GROUPED (ADMIN) - organiza por categoria na ordem do catálogo
  const groupedAdmin = useMemo(() => {
    return items.reduce<Record<CategoriaProduto, Product[]>>((acc, p) => {
      const cat = (p.categoria as CategoriaProduto) ?? "promocoes";
      acc[cat] ??= [];
      acc[cat].push(p);
      return acc;
    }, {} as Record<CategoriaProduto, Product[]>);
  }, [items]);

  // ---- EDIT MODAL
  const [openEdit, setOpenEdit] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);

  const [editNome, setEditNome] = useState("");
  const [editCodigo, setEditCodigo] = useState("");
  const [editPreco, setEditPreco] = useState("");
  const [editCategoria, setEditCategoria] = useState<CategoriaProduto>("promocoes");
  const [editImage, setEditImage] = useState<File | null>(null);

  const editPreviewUrl = useMemo(() => (editImage ? URL.createObjectURL(editImage) : null), [editImage]);

  function openEditModal(p: Product) {
    setEditing(p);
    setEditNome(p.nome ?? "");
    setEditCodigo(p.codigo ?? "");
    setEditPreco(String(p.preco_atacado ?? ""));
    setEditCategoria((p.categoria as CategoriaProduto) ?? "promocoes");
    setEditImage(null);
    setOpenEdit(true);
  }

  function closeEditModal() {
    setOpenEdit(false);
    setEditing(null);
    setEditImage(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setError(null);

    if (!nome.trim()) return setError("Informe o nome do produto.");
    if (!codigo.trim()) return setError("Informe o código/referência.");
    if (!preco.trim()) return setError("Informe o preço de atacado.");

    const precoNumber = parsePreco(preco);
    if (precoNumber === null) return setError("Preço de atacado inválido (use número > 0).");

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

      await refreshList();
      onCreated?.();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro inesperado";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveEdit() {
    if (!editing) return;

    const precoNumber = parsePreco(editPreco);
    if (precoNumber === null) return alert("Preço inválido (use número > 0).");

    try {
      await updateProduct(editing.id, {
        nome: editNome.trim(),
        codigo: editCodigo.trim(),
        preco_atacado: precoNumber,
        categoria: editCategoria,
      });

      if (editImage) {
        await uploadProductImage(editing.id, editImage);
      }

      await refreshList();
      closeEditModal();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Erro ao editar");
    }
  }

  async function handleToggleAtivo(p: Product) {
    try {
      await setProductAtivo(p.id, !p.ativo);
      await refreshList();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Erro ao alterar ativo");
    }
  }

  async function handleDelete(p: Product) {
    const ok = confirm(`Confirma excluir o produto "${p.nome}"? (não tem volta)`);
    if (!ok) return;

    try {
      await deleteProduct(p.id);
      await refreshList();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Erro ao excluir");
    }
  }

  return (
    <div style={{ padding: 24, maxWidth: 1100, margin: "0 auto" }}>
      <h1>Admin</h1>
      <p style={{ color: "#666" }}>Cadastro + gerenciamento (editar/ocultar/excluir).</p>

      {/* CREATE */}
      <div style={{ border: "1px solid #333", borderRadius: 12, padding: 16, marginTop: 12 }}>
        <h2 style={{ marginTop: 0 }}>Cadastrar produto</h2>

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
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
            <div style={{ border: "1px solid #333", borderRadius: 10, padding: 12 }}>
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

      {/* MANAGE */}
      <div style={{ border: "1px solid #333", borderRadius: 12, padding: 16, marginTop: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
          <h2 style={{ margin: 0 }}>Gerenciar produtos</h2>
          <button onClick={refreshList} style={{ padding: "8px 10px" }}>
            Recarregar
          </button>
        </div>

        {loadingList && <p style={{ padding: 12 }}>Carregando...</p>}
        {errorList && <p style={{ padding: 12, color: "crimson" }}>{errorList}</p>}

        {!loadingList && !errorList && (
          <div style={{ display: "grid", gap: 18, marginTop: 12 }}>
            {CATEGORIAS_ORDEM.map((cat) => {
              const lista = groupedAdmin[cat] ?? [];
              if (lista.length === 0) return null;

              return (
                <section key={cat} style={{ borderTop: "1px solid #333", paddingTop: 12 }}>
                  <h3 style={{ margin: "0 0 10px" }}>{CATEGORIA_LABEL[cat]}</h3>

                  <div style={{ display: "grid", gap: 10 }}>
                    {lista.map((p) => (
                      <div
                        key={p.id}
                        style={{
                          border: "1px solid #333",
                          borderRadius: 12,
                          padding: 12,
                          display: "grid",
                          gap: 8,
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
                          <div>
                            <strong>{p.nome}</strong>{" "}
                            <span style={{ color: p.ativo ? "#7CFC00" : "#ff6b6b" }}>
                              ({p.ativo ? "ativo" : "inativo"})
                            </span>

                            <div style={{ color: "#999", fontSize: 12 }}>
                              {p.codigo} • R$ {Number(p.preco_atacado).toFixed(2)}
                            </div>
                          </div>

                          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                            <button onClick={() => openEditModal(p)} style={{ padding: "8px 10px" }}>
                              Editar
                            </button>
                            <button onClick={() => handleToggleAtivo(p)} style={{ padding: "8px 10px" }}>
                              {p.ativo ? "Ocultar" : "Reativar"}
                            </button>
                            <button onClick={() => handleDelete(p)} style={{ padding: "8px 10px" }}>
                              Excluir
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              );
            })}

            {items.length === 0 && <p style={{ color: "#999" }}>Nenhum produto ainda.</p>}
          </div>
        )}
      </div>

      {/* EDIT MODAL */}
      <Modal open={openEdit} title={editing ? `Editar: ${editing.nome}` : "Editar produto"} onClose={closeEditModal}>
        {editing && (
          <div style={{ display: "grid", gap: 12 }}>
            <label style={{ display: "grid", gap: 6 }}>
              Nome
              <input value={editNome} onChange={(e) => setEditNome(e.target.value)} />
            </label>

            <label style={{ display: "grid", gap: 6 }}>
              Código
              <input value={editCodigo} onChange={(e) => setEditCodigo(e.target.value)} />
            </label>

            <label style={{ display: "grid", gap: 6 }}>
              Preço
              <input value={editPreco} onChange={(e) => setEditPreco(e.target.value)} inputMode="decimal" />
            </label>

            <label style={{ display: "grid", gap: 6 }}>
              Categoria
              <select value={editCategoria} onChange={(e) => setEditCategoria(e.target.value as CategoriaProduto)}>
                {CATEGORIAS_ORDEM.map((c) => (
                  <option key={c} value={c}>
                    {CATEGORIA_LABEL[c]}
                  </option>
                ))}
              </select>
            </label>

            <label style={{ display: "grid", gap: 6 }}>
              Trocar foto (opcional)
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={(e) => setEditImage(e.target.files?.[0] ?? null)}
              />
            </label>

            {editPreviewUrl && (
              <img
                src={editPreviewUrl}
                alt="Prévia edição"
                style={{
                  width: "100%",
                  maxHeight: 260,
                  objectFit: "cover",
                  borderRadius: 10,
                  border: "1px solid #333",
                }}
              />
            )}

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
              <button onClick={closeEditModal} style={{ padding: "8px 10px" }}>
                Cancelar
              </button>
              <button onClick={handleSaveEdit} style={{ padding: "8px 10px" }}>
                Salvar alterações
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
