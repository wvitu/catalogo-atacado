const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3333";

export type AppSettings = {
  id: number;
  company_name: string;
  catalog_name: string;
  contact_phone: string | null;
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, init);
  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const msg = data?.message ?? `Erro HTTP ${res.status}`;
    throw new Error(msg);
  }
  return data as T;
}

export function getSettings(): Promise<AppSettings> {
  return request<AppSettings>("/settings");
}

export function updateSettings(input: Partial<Omit<AppSettings, "id">>): Promise<AppSettings> {
  return request<AppSettings>("/settings", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
}
