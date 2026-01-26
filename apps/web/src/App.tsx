import { Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Catalog } from "./pages/Catalog";
import { Admin } from "./pages/Admin";
import { PrintCatalog } from "./pages/PrintCatalog";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Catalog />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/print" element={<PrintCatalog />} />
      </Route>
    </Routes>
  );
}
