import { Link, Outlet } from "react-router-dom";
import { useSettings } from "../contexts/SettingsContext";

export function Layout() {
  const { settings } = useSettings();

  return (
    <div>
      <header className="card" style={{ borderRadius: 0, borderLeft: 0, borderRight: 0 }}>
        <div className="container" style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: 16 }}>
              {settings?.company_name ?? "Carregando..."}
            </div>
            <div style={{ color: "var(--muted)", fontSize: 12 }}>
              {settings?.catalog_name ?? ""}
            </div>
          </div>

          <nav style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link to="/">Catálogo</Link>
            <Link to="/admin">Admin</Link>
            <Link to="/print" target="_blank">Gerar PDF</Link>
          </nav>
        </div>
      </header>

      <main className="container">
        <Outlet />
      </main>

      <footer className="card" style={{ borderRadius: 0, borderLeft: 0, borderRight: 0, marginTop: 24 }}>
        <div className="container" style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <span style={{ color: "var(--muted)", fontSize: 12 }}>
            {settings?.catalog_name ?? ""}
          </span>
          <span style={{ color: "var(--muted)", fontSize: 12 }}>
            Contato: {settings?.contact_phone ?? "—"}
          </span>
        </div>
      </footer>
    </div>
  );
}