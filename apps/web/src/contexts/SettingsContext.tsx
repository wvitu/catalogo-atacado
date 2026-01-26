import { createContext, useContext, useEffect, useState } from "react";
import { getSettings, type AppSettings, updateSettings } from "../api/settings";

type Ctx = {
  settings: AppSettings | null;
  loading: boolean;
  refresh: () => Promise<void>;
  save: (input: Partial<Omit<AppSettings, "id">>) => Promise<void>;
};

const SettingsContext = createContext<Ctx | null>(null);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    setLoading(true);
    try {
      const data = await getSettings();
      setSettings(data);
    } finally {
      setLoading(false);
    }
  }

  async function save(input: Partial<Omit<AppSettings, "id">>) {
    const updated = await updateSettings(input);
    setSettings(updated);
  }

  useEffect(() => {
    refresh();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading, refresh, save }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings deve ser usado dentro de SettingsProvider");
  return ctx;
}
