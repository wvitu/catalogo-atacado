import { useState } from "react";
import { Catalog } from "./pages/Catalog";
import { Admin } from "./pages/Admin";

function App() {
  const [page, setPage] = useState<"catalog" | "admin">("catalog");

  return (
    <>
      <div style={{ padding: 16, maxWidth: 1100, margin: "0 auto", display: "flex", gap: 8 }}>
        <button onClick={() => setPage("catalog")}>Ver Catálogo</button>
        <button onClick={() => setPage("admin")}>Cadastrar Produto</button>
      </div>

      {page === "catalog" ? (
        <Catalog />
      ) : (
        <Admin onCreated={() => setPage("catalog")} />
      )}
    </>
  );
}

export default App;
