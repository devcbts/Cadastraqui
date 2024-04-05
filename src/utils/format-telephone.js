export function formatTelephone(telefone) {
      console.log(telefone
            .replace(/\D/g, '')
            .replace(/(\d{2})(\d?\d{4})(\d{4})/, "($1) $2-$3")
            .replace(/(-\d{4})\d+?$/, '$1'))
      return telefone
            .replace(/\D/g, '')
            .replace(/(\d{2})(\d?\d{4})(\d{4})/, "($1) $2-$3")
            .replace(/(-\d{4})\d+?$/, '$1');
}
