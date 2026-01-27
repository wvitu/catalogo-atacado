import { Routes, Route, Link, useLocation } from "react-router-dom";
import { Catalog } from "./pages/Catalog";
import { Admin } from "./pages/Admin";
import { PrintCatalog } from "./pages/PrintCatalog";

export default function App() {
  const location = useLocation();
  const isPrint = location.pathname === "/print";

  return (
    <div style={{ padding: 16, maxWidth: 1100, margin: "0 auto" }}>
      {!isPrint && (
        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          <Link to="/">Ver Catálogo</Link>
          <Link to="/admin">Cadastrar Produto</Link>
          <Link to="/print" target="_blank" rel="noreferrer">
            Gerar PDF
          </Link>
        </div>
      )}

      <Routes>
        <Route path="/" element={<Catalog />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/print" element={<PrintCatalog />} />
      </Routes>
    </div>
  );
}
