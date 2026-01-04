export function isValidRenavam(renavam) {
  if (!renavam) return false;

  // Mantém apenas dígitos
  const digits = renavam.replace(/\D/g, "");

  // Renavam pode ter 9 (antigo) ou 11 (atual) dígitos
  if (digits.length !== 9 && digits.length !== 11) {
    return false;
  }

  // Validação simples de tamanho/formato; regra de dígito verificador pode ser adicionada depois, se necessário
  return true;
}
