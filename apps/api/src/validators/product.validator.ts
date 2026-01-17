import { isCategoriaValida } from "../constants/categories";

export function parsePrecoAtacado(body: any): number | null {
  const precoInput = body.preco_atacado ?? body.precoAtacado;
  const n = Number(precoInput);
  if (!Number.isFinite(n) || n <= 0) return null;
  return n;
}

export function validateCreateProduct(body: any) {
  const { nome, codigo, categoria } = body;

  if (!nome || typeof nome !== "string" || nome.trim().length < 3) {
    return { ok: false as const, message: "Nome inválido (mínimo 3 caracteres)." };
  }

  if (!codigo || typeof codigo !== "string" || codigo.trim().length < 2) {
    return { ok: false as const, message: "Código inválido (mínimo 2 caracteres)." };
  }

  const precoNumero = parsePrecoAtacado(body);
  if (precoNumero === null) {
    return { ok: false as const, message: "Preço de atacado inválido (use número maior que zero)." };
  }

  if (!isCategoriaValida(categoria)) {
    return {
      ok: false as const,
      message:
        "Categoria inválida. Use: promocoes, bolsas_pochetes, chapeus_bones_viseiras, vestuario, acessorios_brinquedos_infantil, mais_vendidos, lar_casa",
    };
  }

  return { ok: true as const, precoNumero };
}

export function validatePatchProduct(body: any) {
  const { nome, codigo, categoria } = body;

  if (nome !== undefined && (typeof nome !== "string" || nome.trim().length < 3)) {
    return { ok: false as const, message: "Nome inválido (mínimo 3 caracteres)." };
  }

  if (codigo !== undefined && (typeof codigo !== "string" || codigo.trim().length < 2)) {
    return { ok: false as const, message: "Código inválido (mínimo 2 caracteres)." };
  }

  const precoInput = body.preco_atacado ?? body.precoAtacado;
  const precoNumero = precoInput !== undefined ? Number(precoInput) : undefined;

  if (precoNumero !== undefined && (!Number.isFinite(precoNumero) || precoNumero <= 0)) {
    return { ok: false as const, message: "Preço de atacado inválido (use número maior que zero)." };
  }

  if (categoria !== undefined && !isCategoriaValida(categoria)) {
    return {
      ok: false as const,
      message:
        "Categoria inválida. Use: promocoes, bolsas_pochetes, chapeus_bones_viseiras, vestuario, acessorios_brinquedos_infantil, mais_vendidos, lar_casa",
    };
  }

  return { ok: true as const, precoNumero };
}
