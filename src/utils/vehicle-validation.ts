export function isValidPlate(plate: string | null | undefined): boolean {
  if (!plate) return false

  // Normaliza: remove tudo que não for letra ou número e coloca em maiúsculo
  const normalized = plate.toUpperCase().replace(/[^A-Z0-9]/g, "")

  // Placa deve ter exatamente 7 caracteres após normalização
  if (normalized.length !== 7) return false

  // Modelo antigo: ABC1234
  const oldPattern = /^[A-Z]{3}[0-9]{4}$/

  // Padrão Mercosul: ABC1D23
  const mercosulPattern = /^[A-Z]{3}[0-9][A-Z][0-9]{2}$/

  return oldPattern.test(normalized) || mercosulPattern.test(normalized)
}

export function isValidRenavam(renavam: string | null | undefined): boolean {
  if (!renavam) return false

  // Mantém apenas dígitos
  const digits = renavam.replace(/\D/g, "")

  // Renavam pode ter 9 (antigo) ou 11 (atual) dígitos
  if (digits.length !== 9 && digits.length !== 11) {
    return false
  }

  // Validação simples de tamanho/formato; regra de dígito verificador pode ser adicionada depois, se necessário
  return true
}
