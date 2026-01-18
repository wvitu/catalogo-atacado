import { Routes, Route, Link } from "react-router-dom";
import { Catalog } from "./pages/Catalog";
import { Admin } from "./pages/Admin";
import { PrintCatalog } from "./pages/PrintCatalog";

export default function App() {
  return (
    <>
      <div style={{ padding: 16, maxWidth: 1100, margin: "0 auto", display: "flex", gap: 8 }}>
        <Link to="/">Ver Catálogo</Link>
        <Link to="/admin">Cadastrar Produto</Link>
        <Link to="/print" target="_blank">Gerar PDF</Link>
      </div>

      <Routes>
        <Route path="/" element={<Catalog />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/print" element={<PrintCatalog />} />
      </Routes>
    </>
  );
}

