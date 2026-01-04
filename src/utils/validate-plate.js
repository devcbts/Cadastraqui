export function isValidPlate(plate) {
  if (!plate) return false;

  // Normaliza: remove tudo que não for letra ou número e coloca em maiúsculo
  const normalized = plate.toUpperCase().replace(/[^A-Z0-9]/g, "");

  // Placa deve ter exatamente 7 caracteres após normalização
  if (normalized.length !== 7) return false;

  // Modelo antigo: ABC1234
  const oldPattern = /^[A-Z]{3}[0-9]{4}$/;

  // Padrão Mercosul: ABC1D23
  const mercosulPattern = /^[A-Z]{3}[0-9][A-Z][0-9]{2}$/;

  return oldPattern.test(normalized) || mercosulPattern.test(normalized);
}
