// Função para normalizar o nome do curso
export function normalizeString(name: string) {
    return name
        .normalize('NFD') // Normaliza para decompor caracteres acentuados
        .replace(/[\u0300-\u036f]/g, '') // Remove os acentos
        .toLowerCase() // Converte para minúsculas
        .replace(/\s+/g, ''); // Remove espaços
}